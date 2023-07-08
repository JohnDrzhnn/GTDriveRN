import {
  Button,
  Divider,
  Layout,
  List,
  ListItem,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import React from 'react';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import useSWR from 'swr';
import {StyleSheet} from 'react-native';
import {getRoute, getRoutes} from '../api/routes';
import {RouterListItem} from '../types';

type Props = {};

const RouteScreen = (props: Props) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const uid = props?.route?.params?.uid;

  //   {
  //     "type": 1,
  //     "uid": "0af23d2a-4629-11ed-ab77-7085c289dbf7",
  //     "point_description": "ТОЧКА ВЫГРУЗКИ",
  //     "lat": 61.249805,
  //     "lon": 75.167083,
  //     "date": "12.10.22",
  //     "time": "08:33",
  //     "client_name": "Клиент66",
  //     "address": "Ханты-Мансийский Автономный округ - Югра округ  Лангепас г  Парковая ул 7",
  //     "status": 0
  // },

  const {
    data: route,
    isLoading,
    error,
  } = useSWR(`/routes/${uid}`, () => getRoute(uid));

  const routeItem = route?.data;

  if (error || !routeItem) {
    return null;
  }

  const renderItem = ({item, index}): React.ReactElement => {
    

    return (
      <ListItem
        style={{padding: 20}}
        title={item?.client_name}
        description={item?.address}
        accessoryLeft={() => renderItemLeft(item)}
      />
    );
  };

  const renderItemLeft = (item: RouterListItem) => {
    return (
      <Layout>
        <Layout>
          <Text category="s1" style={{textAlign: 'center'}}>
            {item?.time}
          </Text>
        </Layout>
        <Layout>
          <Text category="c2" style={{textAlign: 'center'}}>
            {item?.date}
          </Text>
        </Layout>
      </Layout>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
          
      <List
        style={styles.list}
        data={routeItem?.points}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        ListHeaderComponent={
          <Layout style={{flex: 1, padding: 10}}>
            <Text category="h6" style={{flex: 1, marginBottom: 10}}>
              {routeItem?.name}
            </Text>

            <Text category="s1" style={{flex: 1}}>
              {routeItem?.description_full}
            </Text>
          </Layout>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    
    minHeight: 180,
  },
});

export default RouteScreen;
