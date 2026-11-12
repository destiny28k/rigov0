import { category } from "./category"
import { productVersion, series, specModel, specRow } from "./series"
import { homePage, siteSettings } from "./site"

export const schemaTypes = [category, series, productVersion, specModel, specRow, homePage, siteSettings]

/** Documents that exist exactly once (no "create new", no delete). */
export const SINGLETONS = ["homePage", "siteSettings"]
