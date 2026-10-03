/**
 * Print utility for The Samaritan platform.
 * Allows margin-to-margin certificate printing and document printing
 * without relying on window.open (which is blocked by iframe sandboxes).
 */

export function printCertificate(elementId: string = 'printable-civic-certificate') {
  const el = document.getElementById(elementId);
  if (!el) {
    window.print();
    return;
  }

  // Ensure element has the target class
  el.classList.add('printable-certificate-target');

  // Activate certificate print mode
  document.body.classList.add('printing-certificate');

  const cleanup = () => {
    document.body.classList.remove('printing-certificate');
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);

  try {
    window.print();
  } catch (err) {
    console.warn('[PrintHelper] Direct window.print() failed:', err);
  }

  // Fallback cleanup in case afterprint does not fire in some browsers
  setTimeout(cleanup, 3000);
}

export function printDocument(elementId: string = 'printable-document') {
  const el = document.getElementById(elementId);
  if (!el) {
    window.print();
    return;
  }

  el.classList.add('printable-document-target');
  document.body.classList.add('printing-document');

  const cleanup = () => {
    document.body.classList.remove('printing-document');
    window.removeEventListener('afterprint', cleanup);
  };

  window.addEventListener('afterprint', cleanup);

  try {
    window.print();
  } catch (err) {
    console.warn('[PrintHelper] Direct window.print() failed:', err);
  }

  setTimeout(cleanup, 3000);
}
