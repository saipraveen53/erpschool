const { withAndroidStyles } = require('@expo/config-plugins');

const withAndroidStatusBar = (config) => {
  return withAndroidStyles(config, async (config) => {
    const styles = config.modResults;
    
    // Add color resource #2563eb
    if (!styles.resources.color) styles.resources.color = [];
    if (!styles.resources.color.find(c => c.$.name === 'status_bar_color')) {
      styles.resources.color.push({
        $: { name: 'status_bar_color' },
        _: '#2563eb',
      });
    }

    // Find AppTheme and set android:statusBarColor
    const theme = styles.resources.style.find(s => s.$.name === 'AppTheme');
    if (theme) {
      if (!theme.item) theme.item = [];
      if (!theme.item.find(i => i.$.name === 'android:statusBarColor')) {
        theme.item.push({
          $: { name: 'android:statusBarColor' },
          _: '@color/status_bar_color',
        });
      }
    }
    
    return config;
  });
};

module.exports = withAndroidStatusBar;