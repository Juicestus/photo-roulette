const sizepx = (_width: number, _height: number, ): {width: string, height: string} => {
    return {width: `${_width}px`, height: `${_height}px`};
}

const widthpx = (_width: number): {width: string} => {
    return {width: `${_width}px`};
}

const heightpx = (_height: number, ): {height: string} => {
    return {height: `${_height}px`};
}

const cls = (..._class: string[]): string => {
    return _class.join(' ');
}

export default {
    sizepx,
    widthpx,
    heightpx,
    cls,
}
