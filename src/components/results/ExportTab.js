import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { Form } from 'semantic-ui-react';
import fileDownload from 'js-file-download';

export default class ExportTab extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    download() {
        fileDownload(this.props.draftResultsCSV, this.props.formatDraftResultsCSVName);
    }

    render() {
        return (
            <div className="ExportTab">
                <Form>
                    <Form.TextArea rows="6" width="6" value={this.props.draftResultsCSV} readOnly />
                    <Form.Button primary onClick={() => this.download()} content="Download CSV" />
                </Form>
            </div>
        );
    }
}
