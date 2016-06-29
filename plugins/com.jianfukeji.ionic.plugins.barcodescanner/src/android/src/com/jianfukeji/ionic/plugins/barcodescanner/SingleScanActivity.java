package com.jianfukeji.ionic.plugins.barcodescanner;

import android.app.Activity;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.google.zxing.Result;

import me.dm7.barcodescanner.zxing.ZXingScannerView;


public class SingleScanActivity extends Activity implements ZXingScannerView.ResultHandler {
    private ZXingScannerView scannerView;

    @Override
    public void onCreate(final Bundle state) {
        super.onCreate(state);
        final Resources resources = getApplication().getResources();
        final String packageName = getApplication().getPackageName();
        setContentView(resources.getIdentifier("single_scan_layout", "layout", packageName));
        final ViewGroup contentFrame = (ViewGroup) findViewById(resources.getIdentifier("fl_scanner", "id", packageName));
        scannerView = new ZXingScannerView(this);
        final ImageView ivBack = (ImageView) findViewById(resources.getIdentifier("iv_back", "id", packageName));
        ivBack.setBackgroundResource(resources.getIdentifier("back", "drawable", packageName));
        ivBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        contentFrame.addView(scannerView);

    }

    @Override
    public void onResume() {
        super.onResume();
        scannerView.setResultHandler(this);
        scannerView.startCamera();
    }

    @Override
    public void onPause() {
        super.onPause();
        scannerView.stopCamera();
    }

    @Override
    public void handleResult(final Result result) {
        final Intent intent = new Intent();
        intent.putExtra(BarcodeScanner.SINGLE_KEY, result.getText());
        setResult(RESULT_OK, intent);
        finish();
    }
}