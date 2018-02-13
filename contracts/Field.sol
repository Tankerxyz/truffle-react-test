pragma solidity ^0.4.18;



contract Field {
    uint storedData;

    struct Cell {
        uint y;
        uint x;
        uint color;
//        address delegate; // person delegated to
    }

    uint LENGTH = 1000;
    Cell[1000] private filledCells;
    uint index = 0;

    event cellFilled(Cell cell);

    function fillCell(uint x, uint y, uint color) public {
        Cell memory newFilledCell;

        newFilledCell.x = x;
        newFilledCell.y = y;
        newFilledCell.color = color;

        if (index > LENGTH - 1) {
            filledCells[index++] = newFilledCell;
        }
    }

    function getFilledCells() public view returns (Cell[1000]) {
        return filledCells;
    }
}
