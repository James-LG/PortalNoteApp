import { Cell } from './cell';

export interface Sheet {
    uuid: string;
    name: string;
    cells: Map<string, Cell>;
}
