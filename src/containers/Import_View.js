// containers are "smart" react components that are aware of redux
// they are connected to the redux store and listen on part of the app state
// they use mapStateToProps to specify which parts and use selectors to read them
// avoid having view logic & local component state in them, use "dumb" components instead

import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Form, Grid, Header, Icon, Divider } from 'semantic-ui-react';
import * as importActions from '../store/leagueImport/actions';
import * as importSelectors from '../store/leagueImport/reducer';
import ImportedLeagueView from "../components/ImportedLeagueView";

class ImportView extends Component {

    constructor(props) {
        super(props);
        autoBind(this);
    }

    validLeagueIndicator(){
        if( this.props.successfulImport )
            return <Header as='h2' content={<div><Icon name='checkmark' color='green' size='large'/>Successful Import!</div>}/>;
        else if (this.props.leagueInput && !this.props.successfulImport)
            return <Header as='h2' content={<div><Icon name='close' color='red' size='large'/>Invalid Input!</div>}/>;
    }

    showLeaguePreview(){
        if( this.props.successfulImport )
            return(
                <div>
                    <Grid.Column width='10' verticalAlign='middle'>
                        <Header as='h2' content={this.props.leagueName}/>
                        <Divider/>
                        <ImportedLeagueView parsedLeagueView={this.props.parsedLeagueView} teamList={this.props.teamList}/>
                    </Grid.Column>
                </div>
            );
    }

    render() {
        return (
            <div>
                <div>
                    <strong>Instructions:</strong> Go to your ESPN fantasy league (http://games.espn.com/ffl/leaguerosters?leagueId=<strong>LEAGUE_ID_HERE</strong>, sample here: https://pastebin.com/raw/2eAbShZE ),
                    use Control-A to select the <strong>entire</strong> page.<br/>Paste into the box below. League preview will show in right pane. Then, go to the Setup tab.
                </div>
                <Divider/>
                <Grid columns={2} divided>
                    <Grid.Row>
                        <Grid.Column>
                            <Form>
                                <Form.Group>
                                    <Form.TextArea
                                        label='Paste ESPN League Here'
                                        rows='24'
                                        width={14}
                                        value={this.props.leagueInput}
                                        onChange={this.handleInputChange} />
                                </Form.Group>
                            </Form>
                            {this.validLeagueIndicator()}
                        </Grid.Column>
                        {this.showLeaguePreview()}
                    </Grid.Row>
                </Grid>
            </div>
        );
    }

    handleInputChange(e){
        this.props.dispatch( importActions.processUserInput( e.target.value ) );
    }
}

function mapStateToProps(state) {
    const { parsedLeagueView, teamList } = importSelectors.getParsedLeagueView(state);
    return {
        parsedLeague: importSelectors.getParsedLeague(state),
        leagueInput: importSelectors.getLeagueInput(state),
        leagueName: importSelectors.getLeagueName(state),
        successfulImport: importSelectors.successfulImport(state),
        parsedLeagueView: parsedLeagueView,
        teamList: teamList
    };
}

export default connect(mapStateToProps)(ImportView);
