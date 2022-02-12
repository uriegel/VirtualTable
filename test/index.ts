import '../src/index.js'
import { Column, TableItem, VirtualTable } from '../src/index.js'

const themeChooser = document.getElementById("themeChooser")! as HTMLSelectElement
const changeCols = document.getElementById("changeCols")!
const table = document.querySelector('virtual-table')! as VirtualTable<TestItem>
const disableDate = document.getElementById("disableDate")!

const fill = document.getElementById("fill")!
const show = document.getElementById("show")!

interface TestItem extends TableItem {
    name: string
    ext: string
    size: number
    date: string
    isNotSelectable?: boolean
}

show.onclick = () => table.classList.remove("hidden")

themeChooser.onchange = () => {
    const changeTheme = (theme: string) => {
        ["themeBlue", "themeAdwaita", "themeAdwaitaDark"].forEach(n => {
            document.body.classList.remove(n)    
            table.classList.remove(n)    
        })
        document.body.classList.add(theme)    
        const style = getComputedStyle(document.body)
        exifColor = style.getPropertyValue('--exif-color') 
        selectedExifColor = style.getPropertyValue('--selected-exif-color') 
        table.classList.add(theme)    
        table.reRender()
    }

    switch (themeChooser.selectedIndex) {
        case 0: 
            changeTheme("themeBlue")
            break
        case 1: 
            changeTheme("themeAdwaita")
            break
        case 2: 
            changeTheme("themeAdwaitaDark")
        break
    }
}

var exifColor = getComputedStyle(document.body).getPropertyValue('--exif-color') 
var selectedExifColor = getComputedStyle(document.body).getPropertyValue('--selected-exif-color') 

const widthstr = localStorage.getItem("widths")
const widths = widthstr ? JSON.parse(widthstr) : []
let columns: Column<TestItem>[] = [{
    name: "Name",
    isSortable: true,
    render: (td, item) => {
        var t = document.querySelector('#folder') as HTMLTemplateElement
        td.appendChild(document.importNode(t.content, true))
        const span = document.createElement('span')
        span.innerHTML = item.name
        td.appendChild(span)
    }
}, {
    name: "Ext.",
    render: (td, item) => td.innerHTML = item.ext
}, {
    name: "Größe",
    isSortable: true,
    isRightAligned: true,
    render: (td, item) => {
        td.innerHTML = item.size.toString()
        td.classList.add("rightAligned")
    }
}, {
    name: "Datum",
    isSortable: true,
    render: (td, item) => {
        td.innerHTML = item.date
        td.style.color = item.isSelected ? selectedExifColor : exifColor
    }
}]
if (widths)
    columns = columns.map((n, i)=> ({ ...n, width: widths[i]}))
    
table.renderRow = (item, tr) => {
    if (item.name.endsWith("4"))
        tr.style.opacity = "0.4"
}
table.setColumns(columns)
const items = Array.from(Array(40).keys())
    .map(index => ({
        name: "Eintrag " + index,
        ext: "ext",
        date: "24.03.1999 14:23",
        size: 2344 + index
    }))

fill.onclick = () => table.setItems(items)

table.setRestriction((items, restrictValue) => items.filter(n => n.name.toLowerCase().startsWith(restrictValue.toLowerCase())))

var saveWidths = true
table.addEventListener("columnwidths", e => {
    if (saveWidths) 
        localStorage.setItem("widths", JSON.stringify((e as CustomEvent).detail))
})
table.addEventListener("columnclick", e => {
    console.log("columnclick", (e as CustomEvent).detail)
})
table.addEventListener("keydown", evt => {
    switch (evt.which) {
        case 35: // end
            if (evt.shiftKey) {
                const pos = table.getPosition()
                table.items.forEach((item, i) => item.isSelected = !item.isNotSelectable && i >= pos)                     
                table.refresh()
            }
            break
        case 36: // home
            if (evt.shiftKey) {
                const pos = table.getPosition()
                table.items.forEach((item, i) => item.isSelected = !item.isNotSelectable && i <= pos)                     
                table.refresh()
            }
            break
        case 45: { // Ins
            const pos = table.getPosition()
            table.items[pos].isSelected = !table.items[pos].isSelected 
            table.setPosition(pos + 1)
            break
        }
        case 107: { // Numlock +
            table.items.forEach(n => n.isSelected = true)
            table.refresh()
            break
        }
        case 109: { // Numlock -
            table.items.forEach(n => n.isSelected = false)
            table.refresh()
            break
        }
    }
})

table.addEventListener("enter", e => {
    console.log("Enter", (e as CustomEvent).detail)
})

changeCols.addEventListener("click", () => {
    saveWidths = false
    table.setColumns([{
        name: "Name",
        isSortable: true,
        render: (td, i) => {},
        subItem: {
            name: "Ext."
        }
    }, {
        name: "Datum", 
        render: (td, i) => {},
        isSortable: true
    }, {
        name: "Art",
        render: (td, i) => {}
    }])

})

var disabled = false
disableDate.onclick = () => {
    disabled = !disabled
    table.disableSorting(3, disabled) 
}


