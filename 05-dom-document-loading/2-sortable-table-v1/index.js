export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this._createTable();
    this.subElements = this._getSubElements();
  }

  _createTableHeader() {
    const tableHeader = document.createElement("div");
    tableHeader.className = "sortable-table__header sortable-table__row";
    tableHeader.dataset.element = "header";

    this.headerConfig.forEach(({ id, title, sortable }) => {
      const headerCell = document.createElement("div");
      headerCell.className = "sortable-table__cell";
      headerCell.dataset.id = id;
      headerCell.dataset.sortable = sortable;
      headerCell.innerHTML = `<span>${title}</span>`;
      tableHeader.appendChild(headerCell);
    });

    return tableHeader;
  }

  _createTableBody() {
    const tableBody = document.createElement("div");
    tableBody.dataset.element = "body";
    tableBody.className = "sortable-table__body";
    this.data.forEach((item) => {
      const bodyCell = `
        <a href="/products/${item.id}" class="sortable-table__row">
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image"></div>
          <div class="sortable-table__cell">${item.title}</div>

          <div class="sortable-table__cell">${item.quantity}</div>
          <div class="sortable-table__cell">${item.price}</div>
          <div class="sortable-table__cell">${item.sales}</div>
        </a>
      `;
      tableBody.insertAdjacentHTML("beforeend", bodyCell);
    });
    return tableBody;
  }

  _createTable() {
    const table = document.createElement("div");
    const tableHeader = this._createTableHeader();
    const tableBody = this._createTableBody();
    table.append(tableHeader, tableBody);
    return table;
  }

  _getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
    console.log(result);

    return result;
  }

  _update() {
    const newBody = this._createTableBody();
    this.subElements.body.replaceWith(newBody);
    this.subElements.body = newBody;
  }

  sort(field, order) {
    const direction = order === "desc" ? -1 : 1;
    const { sortable, sortType } = this.headerConfig.find(
      (column) => column.id === field
    );

    if (!sortable) {
      return;
    }

    if (sortType === "string") {
      this.data = this.data.sort(
        (a, b) =>
          direction *
          a[field].localeCompare(b[field], ["ru", "en"], {
            caseFirst: "upper",
          })
      );
    } else {
      this.data = this.data.sort((a, b) => direction * (a[field] - b[field]));
    }
    this._update();
  }

  destroy() {
    this.element.remove();
  }
}
