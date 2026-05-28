import { colors } from '@/ui/theme/colors';
import { TabOption, useNavigation, useUnreadNotificationsCount } from '@unisat/wallet-state';

import { BaseView } from '../BaseView';
import { Column } from '../Column';
import { Grid } from '../Grid';
import { Icon, IconTypes } from '../Icon';

export function NavTabBar({ tab: _tab }: { tab: TabOption }) {
  return (
    <Grid columns={2} style={{ width: '100%', height: '67.5px', backgroundColor: colors.bg2 }}>
      <TabButton tabName="home" icon="pearl" data-testid="tab-home" />
      <TabButton tabName="settings" icon="settings" data-testid="tab-settings" />
    </Grid>
  );
}

function TabButton({
  tabName,
  icon,
  'data-testid': dataTestId
}: {
  tabName: TabOption;
  icon: IconTypes;
  'data-testid'?: string;
}) {
  const nav = useNavigation();
  const unreadNotificationCount = useUnreadNotificationsCount();

  return (
    <Column
      justifyCenter
      itemsCenter
      onClick={() => {
        if (tabName === 'home') {
          nav.navigate('MainScreen');
        } else if (tabName === 'settings') {
          nav.navigate('SettingsTabScreen');
        }
      }}
      data-testid={dataTestId}>
      <Icon size={20} icon={icon} color="white_muted" />
      <BaseView style={{ position: 'relative' }}>
        {tabName === 'settings' && unreadNotificationCount > 0 && (
          <BaseView
            style={{
              position: 'absolute',
              top: -28,
              right: -10,
              width: 7,
              height: 7,
              backgroundColor: '#F55454',
              borderRadius: '50%',
              borderWidth: 1,
              borderColor: 'white'
            }}></BaseView>
        )}
      </BaseView>
    </Column>
  );
}
