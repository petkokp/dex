import {
  EventFragment,
  FunctionFragment,
  Interface,
  ParamType,
} from 'ethers/utils';

export interface ContractMetadata {
  abi:
    | string
    | Interface
    | (string | FunctionFragment | EventFragment | ParamType)[];
  address: string;
}
