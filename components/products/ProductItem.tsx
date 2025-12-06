import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { config } from "@/constants/config";
import Button from "../ui/Button";
import Modal from 'react-native-modal';

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function ProductItem({
  product,
  categoriesData,
  handleDelete,
}: any) {
  const { t } = useTranslation();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = React.useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View
      key={product.id}
      className="bg-white rounded-xl  mb-3 shadow-sm w-[45%] mx-2"
    >
      {/* product Image */}
      <View className="relative">
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            className="w-full h-44 rounded-lg mr-3"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-44 rounded-lg bg-gray-100 items-center justify-center mr-3">
            <Ionicons name="image-outline" size={32} color="#9CA3AF" />
          </View>
        )}

        <TouchableOpacity 
        // onPress={() => handleDelete(product.id)}
        onPress={() => toggleModal()}
        className="absolute bg-red-600 w-10 h-10 top-3 right-3 flex flex-row items-center justify-center rounded-full">
          <Ionicons name="trash-outline" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/*  product info  */}
      <View className="py-3 px-2">
        <Text className="font-bold text-lg text-center text-black">
          {product?.name}
        </Text>

         <Text className="font-bold text-lg text-center text-black">
          {product?.category?.title}
        </Text>

        <View>
          {product?.attributes?.length === 0 ? (
            <Text>
              {product.price} {config.CURRENCY}{" "}
            </Text>
          ) : null}

          {product?.attributes && product?.attributes?.length > 0 && (
            <View className="mt-2">
              {product.attributes.map((attr: any) => (
                <View key={attr.id} className="mb-1">
                  <Text className="text-black font-bold mb-2">{attr.name}</Text>

                  {attr.values && attr.values.length > 0 ? (
                    <View className="flex flex-row">
                      {attr.values.map((val: any, index: number) => (
                        <Text
                          key={index}
                          className=" ml-2 bg-primary text-xs px-2 py-1 rounded-full text-white"
                        >
                          {val.value} - {val.price}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Product Actions */}

      <View>
        <Button
          className="bg-green-600 py-2"
          title={t("common.edit")}
          onPress={() =>
            router.push({
              pathname: "/stores/products/update",
              params: { data: JSON.stringify(product) },
            })
          }
        />

      </View>

      {/* Action Buttons */}
      {/* <View className="flex-row mt-3 pt-3 border-t border-gray-100">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/stores/products/update",
              params: { data: JSON.stringify(product) },
            })
          }
          className="flex-1 flex-row items-center justify-center bg-green-500 rounded-lg py-2 mr-2"
        >
          <Ionicons name="create-outline" size={18} color="white" />
          <Text className="text-white ml-1 font-medium">
            {t("categories.edit")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(product.id)}
          className="flex-1 flex-row items-center justify-center bg-red-500 rounded-lg py-2"
        >
          <Ionicons name="trash-outline" size={18} color="white" />
          <Text className="text-white ml-1 font-medium">
            {t("categories.delete")}
          </Text>
        </TouchableOpacity>
      </View> */}



      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={{flex: 1}}>
          <Text>I am the modal content!</Text>
        </View>
      </Modal>
    </View>
  );
}
