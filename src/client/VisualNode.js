var _ = require('lodash');
var BaseNode = require('./BaseNode');

var { nodeSidePairs } = require('./sideUtils');

let sizeX = 30;
let sizeY = 18;

class VisualNode extends BaseNode {
    constructor(machine, source) {
        super(machine, source);
        this.state.sequence = [];
        this.state.image = _.map(_.range(0, sizeY + 1), () => _.map(_.range(0, sizeX + 1), () => 0));
        this.state.size = [sizeX, sizeY];
    }

    draw() {
        let [xPos, yPos, ...colors] = this.state.sequence;
        _.each(colors, (color, num) => {
            if (color < 0 || color > 4) return;
            if (this.state.image[yPos][xPos + num] === undefined) return;
            this.state.image[yPos][xPos + num] = color;
        });

        console.log(this.state);
    }

    pass() {
        _.each(nodeSidePairs, ([side]) => {
            try {
                let value = this.read(side);
                if (value < 0) {
                    this.draw();
                } else {
                    this.state.sequence.push(value);
                }
            } catch (e) {
                if (e !== this.WAIT_READ) {
                    throw e;
                }
            }
        });
        return false;
    }
}
VisualNode.nodeType = "visual";
VisualNode.displayName = "Visualization Node";

export default VisualNode;
