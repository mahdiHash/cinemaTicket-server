interface prismaColumnSelectionOptionsWithSelect {
  select?: { [column: string]: boolean | prismaColumnSelectionOptions };
}

interface prismaColumnSelectionOptionsWithInclude {
  include?: {
    _count: boolean | modelsCountOutputTypeArgs; 
    [column: string]: boolean | prismaColumnSelectionOptions | modelsCountOutputTypeArgs
  };
}

interface modelsCountOutputTypeArgs {
  select?: null | {
    [model: string]: boolean
  };
}
// how to exclude a property from index signature
export type prismaColumnSelectionOptions =
  | prismaColumnSelectionOptionsWithInclude
  | prismaColumnSelectionOptionsWithSelect
  | null;
