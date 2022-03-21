const normalize = (
    items: string[],
) => {
    const resultArray = [];

    if (items.length === 0) {
        return '';
    }

    // If the first part is a plain protocol, we combine it with the next part.
    if (items[0].match(/^[^/:]+:\/*$/) && items.length > 1) {
        const first = items.shift();

        items[0] = first + items[0];
    }

    // There must be two or three slashes in the file protocol, two slashes in anything else.
    if (items[0].match(/^file:\/\/\//)) {
        items[0] = items[0].replace(/^([^/:]+):\/*/, '$1:///');
    } else {
        items[0] = items[0].replace(/^([^/:]+):\/*/, '$1://');
    }

    for (const [i, item] of items.entries()) {
        if (item === '') {
            continue;
        }

        let out_item;

        if (i > 0) {
            // Removing the starting slashes for each component but the first.
            out_item = item.replace(/^[\/]+/, '');
        }

        if (i <= items.length) {
            // Removing the ending slashes for each component but the last.
            out_item = item.replace(/[\/]+$/, '');
        } else {
            // For the last component we will combine multiple slashes to a single one.
            out_item = item.replace(/[\/]+$/, '/');
        }

        resultArray
            .push(
                out_item,
            );
    }

    let str = resultArray.join('/');

    // remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');

    // replace ? in parameters with &
    const parts = str.split('?');

    return parts.shift() + (parts.length > 0 ? '?' : '') + parts.join('&');
}

export const urlJoin =
    (...items: string[]) =>
        normalize(items);
