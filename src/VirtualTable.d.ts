export interface Restriction {
    originalItems: any[];
}
export interface SubColumn {
    name: string;
}
export interface Column {
    name: string;
    render: (td: HTMLTableCellElement, item: any) => void;
    width?: number;
    isSortable?: boolean;
    sortIndex?: number;
    isRightAligned?: boolean;
    subItem?: SubColumn;
}
export declare class VirtualTable extends HTMLElement {
    get position(): number;
    set position(value: number);
    private _position;
    items: any[];
    private scrollPosition;
    private wheelTimestamp;
    private itemsPerPage;
    private tableroot;
    private headRow;
    private tableBody;
    private scrollbar;
    private scrollbarElement;
    private scrollbarGrip;
    private upButton;
    private downButton;
    private restrictionInput;
    private draggingReady;
    private columns;
    private resizeTimer;
    private itemHeight;
    private restrictCallback?;
    private restriction?;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    setColumns(columns: Column[]): void;
    disableSorting(columnIndex: number, isDisabled: boolean): void;
    setItems(items: any[]): void;
    setRestriction(restrictCallback: (originalItems: any[], resrictionInput: string) => any[]): void;
    reRender(): void;
    setFocus(): void;
    refresh(): void;
    getPosition(): number;
    setPosition(position: number): void;
    restrictClose(): void;
    private measureItemsPerPage;
    private measureItemHeight;
    private measureScrollbarTop;
    private onPageMouseDown;
    private onGripMouseDown;
    private onWheel;
    private onKeyDown;
    private adjustPosition;
    setFocused(): void;
    render(): void;
    renderRow: (item: any, tr: HTMLElement) => void;
    renderItems(): void;
    private renderItem;
    private renderScrollbarGrip;
    restrictTo(newValue: string): boolean;
}
