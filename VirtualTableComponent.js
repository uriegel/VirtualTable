const template = document.createElement('template')
template.innerHTML = `  
    <style>
        :host {
            --vtc-color: black;
            --vtc-background-color: white;
            --vtc-caption-color: white;
            --vtc-caption-background-color: blue;
            --vtc-caption-separator-color: white;
            --vtc-font-size: 100%;
        }
        table {
            width: 100%;
            border-spacing: 0px;
            color: var(--vtc-color);
            background-color: var(--vtc-background-color);
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
    </style>
    <table>
        <thead>
            <tr></tr>
        </thead>
        <tbody>
            <tr>
                <td>Eintr. 1</td>
                <td>Eintr. 2</td>
                <td>Eintr. 3</td>
            </tr>
            <tr>
                <td>Eintr. 1.1</td>
                <td>Eintr. 2.1</td>
                <td>Eintr. 3.1</td>
            </tr>
        </tbody>
    </table>
`
/**
 * @typedef {Object} Column
 * @property {string} title Title of column
 */

class VirtualTableComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this.headRow = this.shadowRoot.querySelector('thead>tr')
    }

    connectedCallback() {
        let draggingReady = false
         
        const onMouseMove = evt => {
            const thWidth = evt.target.clientWidth + evt.target.clientLeft
            const mouseX = evt.offsetX + evt.target.clientLeft
            const trRect = evt.target.parentElement.getBoundingClientRect()
            const absoluteRight = trRect.width + trRect.x                
            draggingReady = 
                (mouseX < 3 || mouseX > thWidth - 4) 
                && (evt.pageX - trRect.x > 4)
                && (evt.pageX < absoluteRight - 4)
            document.body.style.cursor = draggingReady ? 'ew-resize' : 'auto'
        }

        const onMouseDown = evt => {
            if (draggingReady) {
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
    
                const onup = () => {
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
                }
    
                window.addEventListener('mousemove', onmove)
                window.addEventListener('mouseup', onup)
                evt.preventDefault()
                evt.stopPropagation()
            }
        }

        this.headRow.addEventListener('mousemove', onMouseMove)
        this.headRow.addEventListener('mouseleave', () => {
            draggingReady = false
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
    
        columns.forEach(n => {
            const th = document.createElement('th')
            th.innerHTML = n.name
            if (n.width)
                th.style.width = n.width + '%'
            this.headRow.appendChild(th)
        })
    }
}

customElements.define('virtual-table-component', VirtualTableComponent)