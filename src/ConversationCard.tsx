import { ConversationDto } from "../chat";
import { Component } from "react";
import React from "react";
import { proxy } from "./Proxy";

export class ConversationCard extends Component<{
    conversation: ConversationDto,
    selected: boolean,
    onSelect: () => void
}> {
    componentDidMount() {
        proxy.addEventListener("message", (cid, m) => {
            if (cid === this.props.conversation.channelId) this.forceUpdate();
        }, this);
    }
    componentWillUnmount() {
        proxy.removeAllEventListener(this);
    }
    render() {
        let lastMessage = this.props.conversation.lastMessages.length > 0 ?
            this.props.conversation.lastMessages[this.props.conversation.lastMessages.length - 1] : null;
        return (
            <div className={"conversation-card" + (this.props.selected ? " selected" : "")}
                onClick={() => this.props.onSelect()}> <div className="row">
                    <span className="channel-name">{this.props.conversation.name}</span> <span className="time">
                        {lastMessage && new Date(lastMessage.timeStamp).toLocaleDateString()} </span>
                </div>
                <span className="last-message">{lastMessage?.content}</span> </div>
        );
    }
}