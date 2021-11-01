import React, { Component } from 'react';
import CreatableSelect from 'react-select/creatable';

export default class CreatableInputOnly extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: '',
            value: [],
        }
    }

    componentDidMount() {
        this.setState({ value: this.props.tags?this.props.tags.map(item=>({label:item,value:item})):[]})
    }

    handleChange = (value,actionMeta) => {
        if(value==null)
        value=[]
        this.props.onTagsChange(value.map(item=>item.value))
        this.setState({ value });
    };

    handleInputChange = (inputValue) => {
        this.setState({ inputValue: inputValue });
    };

    handleKeyDown = (event) => {
        let { inputValue, value } = this.state;

        if (value === null) {
            value = []
        }
        switch (event.key) {
            case"Tab":
            case 'Enter':
                let validation = true;
                if (value.length != 0) {
                    if (value.find(item => item.label === inputValue)||inputValue==='') {
                        validation = false
                    }
                }
                if (validation) {
                    value.push({
                        label: inputValue,
                        value: inputValue
                    })
                    this.setState({
                        inputValue: '',
                        value: value,
                    });
                    this.props.onTagsChange(value.map(item=>item.value))
                }
                event.preventDefault();
        }
    };
    render() {
        const { inputValue, value } = this.state;
        return (
            <CreatableSelect
                components={{
                    DropdownIndicator: null,
                }}
                styles={this.props.styles}
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={this.handleChange}
                onInputChange={this.handleInputChange}
                onKeyDown={this.handleKeyDown}
                placeholder={''}
                value={value}
            />
        );
    }
}