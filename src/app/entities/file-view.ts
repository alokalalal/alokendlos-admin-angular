import { IdentifierView } from '../view/common/identifier-view';

export class FileView extends IdentifierView {
    fileId: string;
    name: string;

    constructor(fileView: FileView) {
        super(fileView)
        this.fileId = fileView.fileId;
        this.name = fileView.name;
    }
}