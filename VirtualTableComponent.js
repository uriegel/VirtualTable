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
        }
        thead {
            color: var(--vtc-caption-color);
            background-color: var(--vtc-caption-background-color);
        }
        th {
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

    /**
     * 
     * @param {Column[]} columns 
     */
    setColumns(columns) {
        let last
        while (last = this.headRow.lastChild) 
            this.headRow.removeChild(last)
    
        columns.forEach(n => {
            const th = document.createElement('th')
            th.innerHTML = n.name
            this.headRow.appendChild(th)
        })
    }
}

customElements.define('virtual-table-component', VirtualTableComponent)