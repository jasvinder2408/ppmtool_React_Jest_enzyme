import * as React from 'react';
import {Accordion, Grid, Icon, SegmentProps} from "semantic-ui-react";

interface AccordionSegmentState {
    active: boolean
}

interface AccordionSegmentProps {
    segmentHeader: string
    accordionContent?: any
    centered?: boolean
    contentHidden?: boolean
}

export class AccordionSegment extends React.Component<AccordionSegmentProps & SegmentProps,AccordionSegmentState> {
    constructor(props: AccordionSegmentProps & SegmentProps, state: AccordionSegmentState) {
        super(props, state);
        this.state = {
            active: true
        };
    }

    handleClick = (e:any) => {
        if (!this.props.contentHidden) {
            this.setState({active:!this.state.active})
        }
    };

    public render() {
        return (
            <div style={{paddingBottom:'20px'}}>
                <Accordion styled={true} fluid={true}>
                    <Accordion.Title active={this.state.active} icon={'plus'}
                                     onClick={this.handleClick}
                                     style={{backgroundColor:'#f3f4f5'}}>
                        <Icon name={this.state.active ? 'minus' : 'plus'}
                              style={{float: 'right', cursor: 'pointer'}}
                              />
                        {this.props.segmentHeader}
                    </Accordion.Title>
                    <Accordion.Content active={this.state.active && !this.props.contentHidden}>
                        <Grid centered={this.props.centered}>
                            <Grid.Row>
                                {this.props.children ? this.props.children : this.props.accordionContent}
                            </Grid.Row>
                        </Grid>
                    </Accordion.Content>
                </Accordion>
            </div>
        );
    }
}