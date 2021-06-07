import React, { useState, useContext } from "react";

import { ActivityIndicator, Colors } from "react-native-paper";

import {
  AccountBackground,
  AccountCover,
  AccountContainerHome,
  AuthButton,
  AuthInput,
  ErrorContainer,
  Title,
  Link,
} from "../components/account.styles";
import { Text } from "../../../components/typopraphy/text.component";
import { Spacer } from "../../../components/spacer/spacer.component";
// import { AuthenticationContext } from "../../../services/authentication/authentication.context";

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
//   const { onRegister, isLoading, error } = useContext(AuthenticationContext);
  return (
    <AccountBackground>     
      <AccountContainerHome>
        <AccountCover />
        <Title>IS</Title>
        <AuthInput
          label="Email"
          value={email}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
          outlineColor="rgba(255, 255, 255, 0.3)"
          mode="outlined"
          theme={{colors: {primary: '#363636', underlineColor: 'transparent'}}}
          onChangeText={(u) => setEmail(u)}
        />
        <Spacer size="small">
          <AuthInput
            label="Mật khẩu"
            value={password}
            textContentType="password"
            secureTextEntry
            autoCapitalize="none"
            outlineColor="rgba(255, 255, 255, 0.3)"
            mode="outlined"
            theme={{colors: {primary: '#363636', underlineColor: 'transparent'}}}
            onChangeText={(p) => setPassword(p)}
          />
        </Spacer>
        <Spacer size="small">
          <AuthInput
            label="Nhập lại mật khẩu"
            value={repeatedPassword}
            textContentType="password"
            secureTextEntry
            autoCapitalize="none"
            outlineColor="rgba(255, 255, 255, 0.3)"
            mode="outlined"
            theme={{colors: {primary: '#363636', underlineColor: 'transparent'}}}
            onChangeText={(p) => setRepeatedPassword(p)}
          />
        </Spacer>
        {/* {error && (
          <ErrorContainer size="large">
            <Text variant="error">{error}</Text>
          </ErrorContainer>
        )} */}
        <Spacer size="large">
          {/* {!isLoading ? ( */}
            <AuthButton
              icon="email"
              mode="contained"
            //   onPress={() => onRegister(email, password, repeatedPassword)}
            >
              Đăng ký
            </AuthButton>
          {/* ) : (
            <ActivityIndicator animating={true} color={Colors.blue300} />
          )} */}
        </Spacer>
        <Spacer size="large">
          <Link mode="contained" onPress={() => navigation.navigate("Login")}>
            Đăng nhập
          </Link>
        </Spacer>
      </AccountContainerHome>     
    </AccountBackground>
  );
};
