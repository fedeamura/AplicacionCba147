package com.cordoba;

import android.app.Application;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; 
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage; // <-- Add this line

import com.facebook.react.ReactApplication;
import com.airbnb.android.react.maps.MapsPackage;
import org.vovkasm.WebImage.WebImagePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.wix.interactable.Interactable;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.microsoft.codepush.react.CodePush;
import com.airbnb.android.react.lottie.LottiePackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.imagepipeline.decoder.SimpleProgressiveJpegConfig;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }
    
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.asList(
          new MainReactPackage(),
            new LinearGradientPackage(),
            new Interactable(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new RNFSPackage(),
            new ExtraDimensionsPackage(),
            new LottiePackage(),
            new WebImagePackage(),
            new VectorIconsPackage(),
            new SnackbarPackage(),
            new RNSensitiveInfoPackage(),
//            new ReactNativePushNotificationPackage(),
            new MapsPackage(),
              new RNFirebasePackage(),
              new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    ImagePipelineConfig config = ImagePipelineConfig.newBuilder(this)
                .setProgressiveJpegConfig(new SimpleProgressiveJpegConfig())
                .setResizeAndRotateEnabledForNetwork(true)
                .setDownsampleEnabled(true)
                .build();
    Fresco.initialize(this, config);
  }


}
