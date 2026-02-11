import Reactotron, {networking, trackGlobalLogs} from 'reactotron-react-native';

Reactotron.configure() // controls connection & communication settings
  .useReactNative(networking()) // add all built-in react native plugins
  .use(trackGlobalLogs())
  .connect(); // let's connect!
