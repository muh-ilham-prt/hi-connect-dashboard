const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );

export { escapeHtml };

// Open a printable document in a new window and trigger the print dialog.
export function printHtml(html) {
  const win = window.open("", "_blank", "width=794,height=1123");
  if (!win) throw new Error("Popup blocked");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
    win.close();
  }, 400);
}