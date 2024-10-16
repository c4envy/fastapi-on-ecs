import React from 'react';
import { useNumberInput, HStack, Button, Input } from '@chakra-ui/react';

const QuantityInput = ({ value, onIncrease, onDecrease, onChange, min, max, color }) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
    step: 1,
    value,
    min,
    max,
    precision: 0,
  });

  const inc = getIncrementButtonProps({
    onClick: onIncrease,
  });

  const dec = getDecrementButtonProps({
    onClick: onDecrease,
  });

  const input = getInputProps({
    value,
    onChange: (event) => onChange(event.target.value),
  });

  return (
    <HStack minW="170px">
      <Button {...dec}>-</Button>
      <Input {...input} type="number" variant="outline" value={value} textAlign="center" color={color} />
      <Button {...inc}>+</Button>
    </HStack>
  );
};

export default QuantityInput;
