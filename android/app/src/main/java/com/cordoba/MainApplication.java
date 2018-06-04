package com.cordoba;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import org.vovkasm.WebImage.WebImagePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.wix.interactable.Interactable;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.github.xfumihiro.react_native_image_to_base64.ImageToBase64Package;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import org.vovkasm.WebImage.WebImagePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.wix.interactable.Interactable;
import com.imagepicker.ImagePickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.microsoft.codepush.react.CodePush;
import org.vovkasm.WebImage.WebImagePackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.wix.interactable.Interactable;
import ca.jaysoo.extradimensions.ExtraDimensionsPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

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
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFSPackage(),
            new WebImagePackage(),
            new VectorIconsPackage(),
            new RNSensitiveInfoPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new Interactable(),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new RNFetchBlobPackage(),
            new ExtraDimensionsPackage(),
            new ImageToBase64Package(),
            new ImageResizerPackage(),
            new WebImagePackage(),
            new VectorIconsPackage(),
            new RNSensitiveInfoPackage(),
            new MapsPackage(),
            new LinearGradientPackage(),
            new Interactable(),
            new ImagePickerPackage(),
            new RNFirebasePackage(),
            new ExtraDimensionsPackage(),
            new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
            new WebImagePackage(),
            new MapsPackage(),
            new VectorIconsPackage(),
            new RNSensitiveInfoPackage(),
            new LinearGradientPackage(),
            new Interactable(),
            new ExtraDimensionsPackage(),
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
  }
}
