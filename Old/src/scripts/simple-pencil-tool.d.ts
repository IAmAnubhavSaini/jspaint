import { IPoint } from './Point.js';
declare class Pencil {
    id: string;
    selectionId: string;
    width: number;
    LastPoint: IPoint;
    classes: string;
    title: string;
    start(options: any): void;
    stop(options: any): void;
    ContextMenu: {
        activate: (options: any) => void;
        deactivate: (options: any) => void;
        getOptions: () => {
            tool: any;
            id: string;
            containerSelectionCriterion: string;
        };
    };
}
export default Pencil;
//# sourceMappingURL=simple-pencil-tool.d.ts.map