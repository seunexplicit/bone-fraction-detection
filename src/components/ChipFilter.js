import React from 'react';
import { Flex, Tag, Button } from 'antd';
import { Colors } from '../constants/colors';
import { Ellipse } from '../svgs/Ellipse';

const FilterButton = ({onClick,  text, disabled}) => {
    return (
        <Button 
            onClick={onClick} 
            color="primary" 
            variant="text"
            disabled={disabled}
            style={{ padding: 0 }}
        >
            {text}
        </Button>
    )
}

export const ChipFilter  = ({ chipValues, onFilterChange }) => {
    const [selectedTags, setSelectedTags] = React.useState([]);

    const handleChange = (tag, checked) => {
      setSelectedTags(checked? [...selectedTags, tag] : selectedTags.filter(t => t!== tag));
    };

    React.useEffect(() => {
        // Call the parent component's onFilterChange function with the selected tags.
        onFilterChange?.(selectedTags);  
    }, [selectedTags])

    return (
        <Flex vertical>
            <Flex gap={17} style={{ marginBottom: 11}}>
                <FilterButton
                    onClick={() => setSelectedTags(chipValues.map(({ value }) => value))}  
                    text="Select all" 
                    disabled={selectedTags.length === chipValues.length}
                />
                <FilterButton 
                    onClick={() => setSelectedTags([])} 
                    text="Deselect all"
                    disabled={!selectedTags.length}
                />
            </Flex>
            <Flex gap={9} wrap align="center">
                {chipValues.map(({ value, color }) => {
                    const isSelected = selectedTags.includes(value);

                    return (<Tag.CheckableTag
                        color={color}
                        key={value}
                        style={{ borderColor: color, borderRadius: 25, color: Colors.TEXT, padding: '4px 13px', ...(isSelected && { backgroundColor: `${color}45`}) }}
                        checked={isSelected}
                        onChange={(checked) => handleChange(value, checked)}
                    >
                        <Ellipse width={8} style={{ color, marginRight: 8 }} /> {value}
                    </Tag.CheckableTag>)
                })}
            </Flex>
        </Flex>
    )
}