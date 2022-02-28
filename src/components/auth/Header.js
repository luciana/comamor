import {View, Text, useTheme } from "@aws-amplify/ui-react";


export function Header() {
  const { tokens } = useTheme();

  return (
    <View textAlign="center" >
     <Text padding={tokens.space.small}> Diario do Papai </Text>
    </View>
  );
}
