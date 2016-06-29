package com.jianfukeji.ionic.plugins.barcodescanner;

import android.content.Intent;

import java.util.ArrayList;
import java.util.Arrays;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;

import org.apache.cordova.CordovaPlugin;

public class BarcodeScanner extends CordovaPlugin {
    public static final String SINGLE_KEY = "single";
    public static final String MULTIPLE_KEY = "multiple";
    public static final String SCANNED_CODES = "scanned_codes";
    private static final int REQUEST_CODE = 1;
    private CallbackContext callbackContext;

    @Override
    public boolean execute(final String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        this.callbackContext = callbackContext;
        if (action.equalsIgnoreCase("scan")) {
            final String type = args.getString(0);
            final Intent intent = new Intent(cordova.getActivity(), type.equalsIgnoreCase(SINGLE_KEY) ? SingleScanActivity.class : MultipeScanActivity.class);
            if (type.equalsIgnoreCase(MULTIPLE_KEY)) {
                final String codes = args.getString(1);
                intent.putExtra(SCANNED_CODES, codes);
            }
            cordova.startActivityForResult((CordovaPlugin) this, intent, REQUEST_CODE);
            return true;
        }
        return false;
    }

    @Override
    public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
        if (-1 == resultCode) {
            if (data.hasExtra(SINGLE_KEY)) {
                final String result = data.getStringExtra(SINGLE_KEY);
                callbackContext.success(result);
            } else {
                final ArrayList<String> result = data.getStringArrayListExtra(MULTIPLE_KEY);
                final String[] array = result.toArray(new String[0]);
                callbackContext.success(Arrays.toString(array));
            }
        }
    }
}