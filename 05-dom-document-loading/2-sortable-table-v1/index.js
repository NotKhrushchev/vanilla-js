export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.element = this._createTable();
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

  sort(field, order) {
    const direction = order === "desc" ? -1 : 1;

    this.data = this.data.sort(
      (item1, item2) =>
        direction *
        item1[field].localeCompare(item2[field], ["ru", "en"], {
          sensitivity: "variant",
          caseFirst: "upper",
          numeric: true,
        })
    );

    this.element.replaceWith(this._createTable());
  }

  destroy() {
    this.element.remove();
  }
}
