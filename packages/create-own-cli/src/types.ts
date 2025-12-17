//----------------------
// Branded Types
//----------------------

/** Type for creating brand types */
export type TBrand<T, Brand extends string> = T & { __brand: Brand };

/** Branded type for file paths */
export type TBrandFilePath = TBrand<string, "FilePath">;

/** Branded type for regular expression flags @dontexport */
export type TBrandRegExpFlags = TBrand<TRegExpFlags, "RegExpFlags">;
/** Type for regular expression flags @dontexport*/
export type TRegExpFlags = "g" | "i" | "m" | "u" | "y";

//----------------------
// Types
//----------------------
