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
import { colors } from "../../../infrastructure/theme/colors";

// import { AccountContext } from "../../../services/account/account.context";

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const { onLogin, error, isLoading } = useContext(AccountContext);
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
        {/* {error && (
          <ErrorContainer size="large">
            <Text variant="error">{error}</Text>
          </ErrorContainer>
        )} */}
        <Spacer size="large">
          {/* {!isLoading ? ( */}
            <AuthButton
              icon="lock-open-outline"
              mode="contained"
              onPress={() => onLogin(email, password)}
            >
              Đăng nhập
            </AuthButton>
          {/* ) : (
            <ActivityIndicator animating={true} color={Colors.blue300} />
          )} */}
        </Spacer>
        <Spacer size="large">
          <Link onPress={() => navigation.navigate("Register")}>
            Đăng ký
          </Link>
        </Spacer>
      </AccountContainerHome>     
    </AccountBackground>
  );
};
