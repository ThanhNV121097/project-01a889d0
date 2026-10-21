// The lint the shipped CI runs (`npm run lint`). The rules at "error"
// are the ones the pipeline's reviewers used to decide by opinion — file
// size, complexity, unused code and `any` — and a machine now decides them
// with a line number instead. Keep them at "error": a warning here changes
// nothing, because nobody reads a warning in a green run.
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

// An effect whose arrow returns a value hands React that value as its
// cleanup. window.scrollTo returns a Promise in current browsers, so
// `useEffect(() => window.scrollTo(0, 0), [pathname])` crashed every
// page change of a designed site with "destroy is not a function".
const effectBody = {
  selector: "CallExpression[callee.name=/^use(Layout|Insertion)?Effect$/] > ArrowFunctionExpression[expression=true]",
  message: "Give the effect a block body: useEffect(() => { ... }). An arrow that returns a value hands React a cleanup it will call.",
};

// Every colour a page draws comes from theme.css, so that the palette is one
// decision and not a hundred.
//
// The owner picks a direction off a card showing seven colours, and open_pr
// now refuses a design whose theme.css is not those colours. That gate is
// worth nothing if a component can write a colour of its own: the stylesheet
// says one thing, the page shows another, and the owner's choice is carried
// by whichever files happened to use the tokens. It is also what makes the
// Studio's Colours panel work at all — it sets the four variables, and a
// hardcoded card does not move.
//
// Tailwind's arbitrary values (bg-[#0E0E10]) are the common way in, so the
// class strings are read too, in a literal or a template. Only components and
// pages: the editor runtime draws its own selection outlines over the site in
// colours that are deliberately NOT the site's.
const rawColour = [
  {
    selector: ":matches(Literal[value=/#[0-9a-fA-F]{3,8}\\b/], TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}\\b/])",
    message: "No raw colour in a component: every colour is a token in src/theme.css, used through its Tailwind name (bg-ground, text-ink, border-line, bg-accent). The owner chose this palette; a hardcoded value is a second palette nobody chose, and the Studio's Colours panel cannot move it.",
  },
  {
    selector: ":matches(Literal[value=/\\b(?:bg|text|border|fill|stroke|ring|from|via|to|shadow|outline|decoration|accent|caret|divide|placeholder)-\\[(?:#|rgba?\\(|hsla?\\()/], TemplateElement[value.raw=/\\b(?:bg|text|border|fill|stroke|ring|from|via|to|shadow|outline|decoration|accent|caret|divide|placeholder)-\\[(?:#|rgba?\\(|hsla?\\()/])",
    message: "No arbitrary colour class: bg-[#0E0E10] is a colour this design chose twice. Add it to src/theme.css and use its Tailwind name (bg-ground, text-ink, bg-accent).",
  },
];

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
      complexity: ["error", 12],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-restricted-syntax": ["error", effectBody],
    },
  },
  // The palette is theme.css's, everywhere a visitor sees it. Kept to
  // components and pages so the editor runtime, which draws over the site in
  // colours that are not the site's, is left alone.
  {
    files: ["src/components/**/*.{ts,tsx}", "src/pages/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": ["error", effectBody, ...rawColour],
    },
  },
  // Where products are drawn — cards, tiles, product, shop, catalogue and
  // category pages — a raw <img> may not be object-cover. Cover crops the
  // thing being sold: a phone lost its top, a laptop filled its box edge to
  // edge beside a watch floating small, and a cut-out sat in a white box on a
  // dark card. Product pictures go through <ProductImage> (object-contain on
  // the theme's surface). The rule is by file name and by the class on the
  // <img> itself (a string or a template literal), so it has no false alarm
  // outside these files and cannot be dodged by building the class in a
  // template. A photograph that is meant to fill its frame on such a page (a
  // banner, a lifestyle shot) is <Picture className="object-cover"> from
  // src/picture.tsx — the deliberate choice, visible in review.
  // A later block's no-restricted-syntax replaces the earlier one's options,
  // so the effect rule is repeated here.
  {
    files: [
      "src/components/**/*{Card,Tile,Product}*.tsx",
      "src/pages/**/*{Product,Shop,Store,Catalog,Catalogue,Collection,Category}*.tsx",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        effectBody,
        ...rawColour,
        {
          selector: "JSXOpeningElement[name.name='img'] > JSXAttribute[name.name='className'] :matches(Literal[value=/\\bobject-cover\\b/], TemplateElement[value.raw=/\\bobject-cover\\b/])",
          message: "A product picture is never object-cover: use <ProductImage src={…} alt={…}/> (src/components/ProductImage.tsx). A photo meant to fill its frame is <Picture className=\"object-cover\">.",
        },
        // <Grid> exists so a card grid never leaves a hole in its last row,
        // and columnsFor picks the count that fills it (7 → 4 + 3, not
        // 3 + 3 + 1). One run shipped four orphan rows anyway — seven cards
        // in three columns on the home page, four in three on each category
        // page — because a fixed column count is the obvious thing to write
        // and nothing refused it. An affordance nothing requires is one that
        // gets skipped.
        {
          selector: ":matches(Literal[value=/\\bgrid-cols-(?:[2-9]|1[0-2])\\b/], TemplateElement[value.raw=/\\bgrid-cols-(?:[2-9]|1[0-2])\\b/])",
          message: "A fixed column count leaves a hole: seven cards in grid-cols-3 is 3 + 3 + 1. Use <Grid max={4}>{…}</Grid> (src/components/Grid.tsx), which picks the columns from how many items there are and centres the last row — or, for a CSS grid of your own, COLS[columnsFor(items.length, 4)].",
        },
      ],
    },
  },
);
