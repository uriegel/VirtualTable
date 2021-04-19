const template = document.createElement('template')
template.innerHTML = `  
    <style>
        :host {
            --color: red;
            --font-size: 16px;
        }
        p {
            color: var(--color);
            font-size: var(--font-size);
        }
    </style>
    <table>
        <thead>
            <tr></tr>
        </thead>
        <tbody>
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
        console.log("setColumns", columns, this.headRow)
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