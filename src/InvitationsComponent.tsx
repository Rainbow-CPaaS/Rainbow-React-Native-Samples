import React, {Component} from 'react';
import {Invitations, Logger} from 'react-native-rainbow-module';
const logger = new Logger('InvitationsComponent');
export class InvitationsComponent extends Component {
  constructor(props: any) {
    super(props);
  }
  public render() {
    logger.info('has rendered: InvitationsComponent');
    return <Invitations />;
  }
}
