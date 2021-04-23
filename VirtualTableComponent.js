const template = document.createElement('template')
template.innerHTML = `  
    <style>
        :host {
            --vtc-color: black;
            --vtc-background-color: white;
            --vtc-caption-color: white;
            --vtc-caption-background-color: blue;
            --vtc-caption-background-hover-color: #0063ff;
            --vtc-caption-separator-color: white;
            --vtc-font-size: 100%;
            --vtc-scrollbar-width: 16px;
            --vtc-scrollbar-border-color: gray;
            --vtc-scrollbar-border-width: 1px;
            --vtc-scrollbar-button-background-color: white;
            --vtc-scrollbar-button-color: #666;
            --vtc-scrollbar-button-hover-color: #555
            --vtc-scrollbar-button-active-color: #444
            --vtc-scrollbar-button-hover-background-color: rgb(209, 209, 209);
            --vtc-scrollbar-button-active-background-color: #aaa;
            --vtc-scrollbar-grip-color: rgb(209, 209, 209); 
            --vtc-scrollbar-grip-hover-color: #bbb;
            --vtc-scrollbar-grip-active-color: #999;
            --vtc-scrollbar-grip-width: 100%;
        }
        .tableroot {
            position: absolute;
            height: 100%;
            overflow: hidden;
            background-color: var(--vtc-background-color);
            outline-width: 0px;
        }        
        table {
            width: 100%;
            border-spacing: 0px;
            color: var(--vtc-color);
            font-size: var(--vtc-font-size);
            table-layout: fixed;
        }
        table td {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            user-select: none;
            transition: padding-right .4s;
        }            
        thead {
            color: var(--vtc-caption-color);
            background-color: var(--vtc-caption-background-color);
        }
        th {
            text-overflow: ellipsis;
            user-select: none;            
            text-align: left;
            font-weight: normal;
            border-left-style: solid;
            border-left-width: 1px;
            border-left-color: var(--vtc-caption-separator-color);
            padding-left: 5px;
            overflow: hidden;
            white-space: nowrap;
            -webkit-user-select: none;            
            user-select: none;            
        }
        th:first-child {
            border-left-width: 0px;
        }
        .isSortable {
            transition: background-color 0.3s; 
        }
        .isSortable:hover {
            background-color: var(--vtc-caption-background-hover-color);
        }        
        .sortAscending:before {
            position: relative;
            bottom: 11px;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 6px solid var(--vtc-caption-color);
            content: '';
            margin-right: 5px;
        }
        .sortDescending:before {
            position: relative;
            top: 10px;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-top: 6px solid var(--vtc-caption-color);
            content: '';
            margin-right: 5px;
        }
        .scrollbar {
            position: absolute;
            width: var(--vtc-scrollbar-width); 
            right: 0px;
            overflow: hidden;
            border-style: solid;
            box-sizing: border-box;
            border-color: var(--vtc-scrollbar-border-color);
            border-width: var(--vtc-scrollbar-border-width);
            user-select: none;
            display: flex;
            flex-direction: column;  
            transition: transform 0.3s;  
            transform-origin: right top;
            bottom: 0px;
        }
        .scrollbar.hidden {
            transform: scale(0)
        }
        .svg {
            display: var(--vtc-scrollbar-button-display);
            width: 100%;
            background-color: var(--vtc-scrollbar-button-background-color);
            transition: background-color 0.3s;
        }
        .svg:hover {
            background-color: var(--vtc-scrollbar-button-hover-background-color);
        }
        .svg:active {
            background-color: var(--vtc-scrollbar-button-active-background-color);
            cursor: default;
        }
        .button {
            fill: var(--vtc-scrollbar-button-color);
            fill-opacity: 1; 
            stroke:none;            
        }
        .scrollbarElement {
            background-color: var(--vtc-scrollbar-background-color);
            transition: background-color 1s;
            flex-grow: 1;
            position: relative;	
        }
        .scrollbarElement:hover {
            background-color: var(--vtc-scrollbar-background-hover-color);
        }
        .scrollbarElement:active {
            background-color: var(--vtc-scrollbar-background-hover-color);
        }        
        .svg:hover .button {
            fill: var(--vtc-scrollbar-button-hover-color); 
        }
        .svg:active .button {
            fill: var(--vtc-scrollbar-button-active-color); 
        }        
        .grip {
            position: absolute;
            box-sizing: border-box;
            border-radius: var(--vtc-scrollbar-grip-radius);
            background-color: var(--vtc-scrollbar-grip-color);
            width: var(--vtc-scrollbar-grip-width);
            right: var(--vtc-scrollbar-grip-right);
            transition: background-color 0.5s, width 0.5s;
        }   
        .scrollbar:hover .grip {
            width: 100%;
        }
        .scrollbar:active .grip {
            width: 100%;
        }
        .grip:hover {
            background-color: var(--vtc-scrollbar-grip-hover-color);
        }
        .grip:active {
            background-color: var(--vtc-scrollbar-grip-active-color);
            transition: background-color 0s;
        }             
    </style>
    <div class="tableroot">
        <table>
            <thead>
                <tr></tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
    <div class="scrollbar hidden">
        <svg class="svg" viewBox="0 0 100 100" >
            <path class="button" d="M 20,70 50,30 80,70 Z" / >
        </svg>
        <div class="scrollbarElement">
            <div class="grip"></div>
        </div>
        <svg class="svg" viewBox="0 0 100 100" >
            <path class="button" d="M 80,30 50,70 20,30 Z" />
        </svg>
    </div>
`
/**
 * @typedef {Object} Column
 * @property {string} title Title of column
 */

class VirtualTableComponent extends HTMLElement {
    constructor() {
        super()
        this.scrollPosition = 0
        this.attachShadow({ mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.tableroot = this.shadowRoot.querySelector('.tableroot')
        this.headRow = this.shadowRoot.querySelector('thead>tr')
        this.tableBody = this.shadowRoot.querySelector('tbody')
        this.scrollbar = this.shadowRoot.querySelector('.scrollbar')
        this.scrollbarElement = this.shadowRoot.querySelector('.scrollbarElement')
        this.scrollbarGrip = this.shadowRoot.querySelector('.scrollbarElement>div')

        const buttons = this.shadowRoot.querySelectorAll('svg')
        const upButton = buttons[0]
        const downButton = buttons[1]
        upButton.onclick = () => {
            this.scrollPosition = Math.max(this.scrollPosition - 1, 0)
            this.render()
        }
        downButton.onclick = () => {
            this.scrollPosition = Math.min(this.scrollPosition + 1, this.items.length || 0)
            this.render()
        }
    }

    connectedCallback() {
       
        const onMouseMove = evt => {
            const element = evt.target.tagName == "TH" ? evt.target : evt.target.parentElement.parentElement
            const thWidth = element.clientWidth + element.clientLeft
            const mouseX = evt.offsetX + element.clientLeft
            const trRect = element.parentElement.getBoundingClientRect()
            const absoluteRight = trRect.width + trRect.x                
            let draggingReady = 
                (mouseX < 3 || mouseX > thWidth - 4) 
                && (evt.pageX - trRect.x > 4)
                && (evt.pageX < absoluteRight - 4)
            if (draggingReady && evt.target.tagName != "TH") {
                const first = evt.target.style.flexGrow == 1
                if (first && mouseX > thWidth - 4 || !first && mouseX < 3)
                    draggingReady = false
            }
            this.draggingReady = draggingReady
            document.body.style.cursor = this.draggingReady ? 'ew-resize' : 'auto'
        }

        const onMouseDown = evt => {
            if (this.draggingReady) {
                const th = evt.target
                const mouseX = evt.offsetX + th.clientLeft
                const dragleft = mouseX < 3
    
                const startDragPosition = evt.pageX
                const targetColumn = th.closest("th")
    
                const currentHeader = dragleft ? targetColumn.previousElementSibling : targetColumn
                if (!currentHeader)
                    return
                const nextHeader = currentHeader.nextElementSibling
                if (!nextHeader)
                    return
    
                const currentLeftWidth = currentHeader.offsetWidth
                const sumWidth = currentLeftWidth + nextHeader.offsetWidth
    
                const onmove = evt => {
                    document.body.style.cursor = 'ew-resize'
                    let diff = evt.pageX - startDragPosition
                    if (currentLeftWidth + diff < 15)
                        diff = 15 - currentLeftWidth
                    else if (diff > sumWidth - currentLeftWidth - 15)
                        diff = sumWidth - currentLeftWidth - 15
    
                    const getCombinedWidth = (column, nextColumn) => {
                        const firstWidth = 
                            column.style.width
                            ? parseFloat(column.style.width.substr(0, column.style.width.length - 1))
                            : 100 / this.columns.length
                        const secondWidth = 
                            nextColumn.style.width
                            ? parseFloat(nextColumn.style.width.substr(0, nextColumn.style.width.length - 1))
                            : 100 / this.columns.length
                        return firstWidth + secondWidth
                    }                        
    
                    const combinedWidth = getCombinedWidth(currentHeader, nextHeader)
    
                    let leftWidth = currentLeftWidth + diff
                    let rightWidth = sumWidth - currentLeftWidth - diff
                    const factor = combinedWidth / sumWidth
                    leftWidth = leftWidth * factor
                    rightWidth = rightWidth * factor
    
                    currentHeader.style.width = leftWidth + '%'
                    nextHeader.style.width = rightWidth + '%'
                    evt.preventDefault()
                }
    
                const onup = evt => {
                    const getWidths = () => {
                        const ths = Array.from(targetColumn.parentElement.children)
                         return ths.map(th => 
                             th.style.width 
                                ? parseFloat(th.style.width.substr(0, th.style.width.length - 1))
                                : 100 / this.columns.length
                         )
                    }
    
                    window.removeEventListener('mousemove', onmove)
                    window.removeEventListener('mouseup', onup)
                    document.body.style.cursor = 'auto'
                    
                    this.dispatchEvent(new CustomEvent('columnwidths', { detail: getWidths() }))
                    evt.preventDefault()
                    evt.stopPropagation()
                }
    
                window.addEventListener('mousemove', onmove)
                window.addEventListener('mouseup', onup)
                evt.preventDefault()
                evt.stopPropagation()
            }
        }

        window.addEventListener('resize', () => {
            if (!this.resizeTimer && this.items)
                this.resizeTimer = setTimeout(() => {
                    this.resizeTimer = 0
                    this.measureItemsPerPage()
                    this.renderScrollbarGrip()
                    this.renderItems()
                }, 50)
        })
        this.headRow.addEventListener('mousemove', onMouseMove)
        this.headRow.addEventListener('mouseleave', () => {
            this.draggingReady = false
            document.body.style.cursor = 'auto'
        })        
        this.headRow.addEventListener('mousedown', onMouseDown)
    }

    /**
     * 
     * @param {Column[]} columns 
     */
    setColumns(columns) {
        this.columns = columns

        let last
        while (last = this.headRow.lastChild) 
            this.headRow.removeChild(last)
    
        columns.forEach((n, i) => {
            const th = document.createElement('th')
            if (n.width)
                th.style.width = n.width + '%'
            if (n.isSortable) {
                th.onclick = evt => {
                    if (this.draggingReady)
                        return

                    const remove = element =>  {
                        element.classList.remove("sortDescending")
                        element.classList.remove("sortAscending")
                    }

                    const subItem = evt.target.tagName == "SPAN" && evt.target.style.flexGrow != 1
                    Array.from(this.headRow.children)
                        .filter( n => n != th)
                        .forEach(n => {
                            if (n.firstChild.firstChild) {
                                remove(n.firstChild.firstChild)
                                remove(n.firstChild.lastChild)
                            }
                            else
                                remove(n)
                        })
                    let descending = false
                    
                    let element = th.firstChild.firstChild 
                        ? subItem ? th.firstChild.lastChild : th.firstChild.firstChild 
                        : th
                    if (element.classList.contains("sortAscending")) {
                        element.classList.remove("sortAscending")
                        element.classList.add("sortDescending")
                        descending = true
                    } else {
                        element.classList.remove("sortDescending")
                        element.classList.add("sortAscending")
                    }
                    if (th.firstChild.firstChild) {
                        let element = subItem ? th.firstChild.firstChild : th.firstChild.lastChild
                        remove(element)
                    }

                    this.dispatchEvent(new CustomEvent('columclick', { detail: { column: i, descending, subItem } }))
                }
            }
            if (!n.subItem) {
                th.innerHTML = n.name
                if (n.isSortable)
                    th.classList.add("isSortable") 
            }
            else {
                const thDiv = document.createElement('div')
                thDiv.style.display = "flex"
                const thContent = document.createElement('span')
                thContent.innerHTML = n.name
                thContent.style.flexGrow = 1
                const thSubContent = document.createElement('span')
                thSubContent.innerHTML = n.subItem.name
                if (n.isSortable) {
                    thContent.classList.add("isSortable") 
                    thSubContent.classList.add("isSortable") 
                }
                thDiv.appendChild(thContent)
                thDiv.appendChild(thSubContent)
                th.appendChild(thDiv)
            }
            this.headRow.appendChild(th)
            this.scrollbar.style.height = `calc(100% - ${this.headRow.clientHeight}px)` 
        })
    }

    measureItemsPerPage() { this.itemsPerPage = Math.floor((this.tableroot.clientHeight - this.headRow.clientHeight) / this.itemHeight) }
    
    measureItemHeight() {
        const tr = document.createElement('tr')
        const td = document.createElement('td')
        this.columns[0].render(td, this.items[0])
        tr.appendChild(td)
        this.tableBody.appendChild(tr)
        this.itemHeight = tr.offsetHeight
        this.tableBody.removeChild(tr)
    }

    setItems(items) {
        this.items = items
        if (!this.itemHeight) 
            this.measureItemHeight()
            this.measureItemsPerPage()
        this.render()    
    }

    render() {
        this.renderItems()
        this.renderScrollbarGrip()
    }
    
    renderItems() {
        let last
        while (last = this.tableBody.lastChild) 
            this.tableBody.removeChild(last)

        for (let i = this.scrollPosition; 
                i < Math.min(this.itemsPerPage + 1 + this.scrollPosition, this.items.length);
                i++) {
            const tr = this.renderItem(this.items[i])
            this.tableBody.appendChild(tr)
        }
    }

    renderItem(item) {
        const tr = document.createElement('tr')
        this.columns.forEach(col => {
            const td = document.createElement('td')
            col.render(td, item)
            tr.appendChild(td)
        }) 
        return tr
    }

    renderScrollbarGrip() {
        this.scrollbarGrip.style.top = this.scrollPosition * this.itemHeight
        const gripHeight = Math.max(this.scrollbarElement.clientHeight * (this.itemsPerPage / this.items.length || 1), 10)
        this.scrollbarGrip.style.height = `${gripHeight}px`
        if (this.itemsPerPage >= this.items.length - this.scrollPosition)
            this.scrollbar.classList.add('hidden')
        else
            this.scrollbar.classList.remove('hidden')
    }
}

customElements.define('virtual-table-component', VirtualTableComponent)