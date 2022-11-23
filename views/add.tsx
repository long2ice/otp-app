import { Text, View, TextInput, Button, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import Layout from "../components/layout";
import i18n from "../i18n";
import { DefaultTheme, useNavigation } from "@react-navigation/native";
// @ts-ignore
import { TOTP } from "otpauth/dist/otpauth.esm.js";
import { addOTPs } from "../api/otp";

export default function Add() {
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors, defaultValues },
  } = useForm({
    defaultValues: {
      label: "",
      secret: "",
      issuer: "",
      digits: "6",
      period: "30",
      algorithm: "SHA1",
    },
  });
  const labels: Record<OtpFields, string> = {
    label: i18n.t("label"),
    secret: i18n.t("secret"),
    issuer: i18n.t("issuer"),
    digits: i18n.t("digits"),
    period: i18n.t("period"),
    algorithm: i18n.t("algorithm"),
  };
  const onSubmit = async (data: Record<OtpFields, number | string>) => {
    const totp = new TOTP({
      label: data.label as string,
      secret: data.secret as string,
      issuer: data.issuer as string,
      digits: data.digits as number,
      period: data.period as number,
      algorithm: data.algorithm as string,
    });
    const uri = totp.toString();
    await addOTPs([uri]);
    await navigation.goBack();
  };
  return (
    <Layout>
      <View className="mb-4 rounded bg-white p-4">
        {Object.keys(defaultValues ?? {}).map((k) => (
          <View className="border-b border-b-neutral-100 p-2" key={k}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex flex-row items-center">
                  <Text className="w-1/4 text-neutral-500">
                    {labels[k as OtpFields]}
                  </Text>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    className="w-full"
                  />
                </View>
              )}
              name={k as OtpFields}
            />
            {errors[k as OtpFields] && (
              <View className="flex flex-row">
                <View className="w-1/4" />
                <Text className="text-red-500">
                  {i18n.t("field_required", {
                    field: labels[k as OtpFields],
                  })}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
      <TouchableOpacity onPress={handleSubmit(onSubmit)}>
        <View
          className="rounded p-2"
          style={{
            backgroundColor: DefaultTheme.colors.primary,
          }}
        >
          <Text className="text-center text-lg text-white">
            {i18n.t("submit")}
          </Text>
        </View>
      </TouchableOpacity>
    </Layout>
  );
}
