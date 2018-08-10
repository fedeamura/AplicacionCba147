package com.cordoba;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.azendoo.reactnativesnackbar.SnackbarPackage;
import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.imagepipeline.core.ImagePipelineConfig;
import com.facebook.imagepipeline.decoder.SimpleProgressiveJpegConfig;
import com.facebook.react.ReactApplication;
import com.apsl.versionnumber.RNVersionNumberPackage;
import org.vovkasm.WebImage.WebImagePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.wix.interactable.Interactable;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import io.invertase.firebase.RNFirebasePackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.syarul.rnlocation.RNLocation;
import java.util.Arrays;
import java.util.List;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

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
            new RNVersionNumberPackage(),
                    new WebImagePackage(),
                    new VectorIconsPackage(),
                    new SnackbarPackage(),
                    new RNSensitiveInfoPackage(),
                    new MapsPackage(),
                    new LinearGradientPackage(),
                    new Interactable(),
                    new ImageResizerPackage(),
                    new ImagePickerPackage(),
                    new RNFSPackage(),
                    new RNFirebasePackage(),
                    new ExtraDimensionsPackage(),
                    new LottiePackage(),
                    new RNLocation(),
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
