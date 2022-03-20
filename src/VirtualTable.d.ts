export interface Restriction<TItem> {
    originalItems: TItem[];
}
export interface SubColumn {
    name: string;
}
export interface Column<TItem> {
    name: string;
    render: (td: HTMLTableCellElement, item: TItem) => void;
    width?: number;
    isSortable?: boolean;
    sortIndex?: number;
    isRightAligned?: boolean;
    subItem?: SubColumn;
}
export interface TableItem {
    isSelected?: boolean;
}
export declare class VirtualTable<TItem extends TableItem> extends HTMLElement {
    get position(): number;
    set position(value: number);
    private _position;
    items: TItem[];
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
    private saveWidthIdentifier;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    setColumns(columns: Column<TItem>[], saveWidthIdentifier?: string): void;
    disableSorting(columnIndex: number, isDisabled: boolean): void;
    setItems(items: TItem[]): void;
    setRestriction(restrictCallback: (originalItems: TItem[], resrictionInput: string) => TItem[]): void;
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
    renderRow: (item: TItem, tr: HTMLTableRowElement) => void;
    renderItems(): void;
    private renderItem;
    private renderScrollbarGrip;
    restrictTo(newValue: string): boolean;
}
