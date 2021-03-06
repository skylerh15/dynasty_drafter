import React, { Component } from 'react';
import autoBind from 'react-autobind';
import { connect } from 'react-redux';
import { Tab, Dropdown, Button } from 'semantic-ui-react';
import * as resultActions from '../store/results/actions';
import * as importActions from '../store/leagueImport/actions';
import * as setupActions from '../store/setup/actions';
import * as draftActions from '../store/draft/actions';
import * as resultSelectors from '../store/results/reducer';
import * as routerActions from '../store/router/actions';
import TeamStatusTable from '../components/results/TeamStatusTable';
import DraftResultsTable from '../components/results/DraftResultsTable';
import DraftResultsFreeAgents from '../components/results/DraftResultsFreeAgents';
import ExportTab from '../components/results/ExportTab';
import ConfirmModal from '../components/ConfirmModal';
import * as setupSelectors from '../store/setup/reducer';

class ResultsView extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    componentDidMount() {
        this.props.dispatch(resultActions.setResultDraftData());
    }

    state = {
        showConfirm: false
    };

    render() {
        const panes = [
            {
                menuItem: 'Draft Results',
                render: () => (
                    <Tab.Pane>
                        <DraftResultsTable
                            draftResults={this.props.draftResults}
                            teamDropDownList={this.props.teamDropDownList}
                            numOfTeams={this.props.numOfTeams}
                        />
                    </Tab.Pane>
                )
            },
            {
                menuItem: 'Team Info',
                render: () => (
                    <Tab.Pane>
                        <div>
                            <Dropdown
                                selection
                                options={this.props.teamDropDownList}
                                defaultValue={this.props.selectedTeam}
                                onChange={(e, d) => this.onTeamDropDownChange(d)}
                            />
                        </div>
                        <div>
                            <TeamStatusTable selectedTeamStatus={this.props.selectedTeamStatus} />
                        </div>
                    </Tab.Pane>
                )
            },
            {
                menuItem: 'Free Agents',
                render: () => (
                    <Tab.Pane>
                        <DraftResultsFreeAgents
                            freeAgents={this.props.freeAgents}
                            isDefenseEnabled={this.props.isDefenseEnabled}
                        />
                    </Tab.Pane>
                )
            },
            {
                menuItem: 'Export',
                render: () => (
                    <Tab.Pane>
                        <ExportTab
                            draftResultsCSV={this.props.draftResultsCSV}
                            formatDraftResultsCSVName={this.props.formatDraftResultsCSVName}
                        />
                    </Tab.Pane>
                )
            }
        ];
        return (
            <div>
                <Tab panes={panes} />
                <br />
                <Button content="Reset War Room" onClick={() => this.toggleResetConfirm()} />
                <ConfirmModal
                    showConfirmModal={this.state.showConfirm}
                    clickFunction={this.confirm}
                    confirmMessage="Reset War Room"
                    toggleConfirmModal={this.toggleResetConfirm}
                />
            </div>
        );
    }

    onTeamDropDownChange(data) {
        this.props.dispatch(resultActions.setSelectedTeam(data.value));
    }

    toggleResetConfirm() {
        this.setState({ showConfirm: !this.state.showConfirm });
    }

    confirm() {
        this.props.dispatch(importActions.resetState());
        this.props.dispatch(setupActions.resetState());
        this.props.dispatch(draftActions.resetState());
        this.props.dispatch(routerActions.resetState());
        this.toggleResetConfirm();
    }
}

function mapStateToProps(state) {
    return {
        finalDraftArray: resultSelectors.getFinalDraftArray(state),
        finalLeagueArray: resultSelectors.getFinalLeagueArray(state),
        teamDropDownList: resultSelectors.getTeamList(state),
        selectedTeam: resultSelectors.getSelectedTeam(state),
        selectedTeamStatus: resultSelectors.getSelectedTeamInfo(state),
        numOfTeams: resultSelectors.getNumberOfTeams(state),
        draftResults: resultSelectors.getDraftResultsTable(state),
        draftResultsCSV: resultSelectors.getDraftResultCSV(state),
        formatDraftResultsCSVName: resultSelectors.formatDraftResultsCSVName(state),
        isPasswordSet: setupSelectors.isPasswordSet(state),
        checkPassword: setupSelectors.checkPassword(state),
        freeAgents: resultSelectors.getFreeAgents(state)
    };
}

export default connect(mapStateToProps)(ResultsView);
