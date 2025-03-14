interface SpielCategoryOptions {
  [category: string]: string[];
}

interface SpielOptionsByBusinessUnit {
  [businessUnit: string]: SpielCategoryOptions;
}

interface SpielConfig {
  default: string;
  options: string[];
  businessUnits?: SpielOptionsByBusinessUnit;
  recordings: string[];
}

const SpielOptions: any = {
  default: "",
  options: ["SUPPLEMENTARY", "CARD_CLOSURE"],
  recordings: [
    "ORANGE_EASY_BILL",
    "BLUE_ULIFE",
    "BLUE_EASY_BILL",
    "BLUE_EASY_CONVERT",
    "BLUE_EASY_CASH",
    "BLUE_EASY_TRANSFER",
    "DST_PERSONAL_LOAN",
    "EASY_CONVERT",
    "EASY_TRANSFER",
    "EASY_CASH",
    "USHIELD_MERGED",
  ]
};

export default SpielOptions;