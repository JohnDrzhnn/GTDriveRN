import {
  Button,
  Divider,
  Layout,
  List,
  ListItem,
  Text,
  TopNavigation,
} from '@ui-kitten/components';
import React, {useContext} from 'react';
import {RefreshControl, ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import useSWR from 'swr';
import {StyleSheet} from 'react-native';
import {getRoutes} from '../api/routes';
import {RouterListItem} from '../types';
import {UserContext} from '../store/user/UserProvider';

type Props = {};

const HomeScreen = (props: Props) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const {currentUser} = useContext(UserContext);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const {
    data: routes,
  } = useSWR(`/routes?user=${currentUser?.uid}`, () =>
    getRoutes(currentUser?.uid),
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: RouterListItem;
    index: number;
  }): React.ReactElement => (
    <ListItem
      title={item?.name}
      description={item?.description}
      accessoryLeft={() => renderItemLeft(item)}
      onPress={e => props.navigation.navigate('RouteScreen', {...item})}
    />
  );

  const renderItemLeft = (item: RouterListItem) => {
    return (
      <Layout>
        <Layout>
          <Text category="s1" style={{textAlign: 'center'}}>
            {item?.loading_time}
          </Text>
        </Layout>
        <Layout>
          <Text category="c2" style={{textAlign: 'center'}}>
            {item?.loading_date}
          </Text>
        </Layout>
      </Layout>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {routes && routes?.data && routes?.data[0] && (
        <List
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={styles.list}
          data={routes?.data}
          renderItem={renderItem}
          ItemSeparatorComponent={Divider}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    minHeight: 180,
  },
});

export default HomeScreen;
