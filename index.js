import './VirtualTableComponent.js'

const table = document.querySelector('virtual-table-component')
table.setColumns([{
        name: "Name"
    }, {
        name: "Ext.",
    }, {
        name: "Datum"
    }, {
        name: "Größe"
    }]
)

// TODO: Themes with different font sizes
// TODO: Adaptable column widthes
// TODO: Sortable: highlighted, asc, desc
// TODO: SubColumn, sortable