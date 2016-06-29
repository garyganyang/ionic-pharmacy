package com.jianfukeji.ionic.plugins.barcodescanner;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.google.zxing.Result;

import java.util.ArrayList;
import java.util.Arrays;

import me.dm7.barcodescanner.zxing.ZXingScannerView;

public class MultipeScanActivity extends Activity implements ZXingScannerView.ResultHandler {
    private class ResultAdapter extends BaseAdapter {
        private final LayoutInflater inflater;

        public ResultAdapter(final Context context) {
            inflater = LayoutInflater.from(context);
        }

        @Override
        public int getCount() {
            tvCount.setText("当前数量：" + result.size());
            return result.size();
        }

        @Override
        public Object getItem(final int i) {
            return result.get(i);
        }

        @Override
        public long getItemId(final int i) {
            return i;
        }

        @Override
        public View getView(final int position, View view, final ViewGroup viewGroup) {
            ItemViewHolder holder = null;
            if (view == null) {
                holder = new ItemViewHolder();
                view = inflater.inflate(resources.getIdentifier("item_view_holder_layout", "layout", packageName), viewGroup, false);
                holder.textView = (TextView) view.findViewById(resources.getIdentifier("text_view", "id", packageName));
                holder.imageView = (ImageView) view.findViewById(resources.getIdentifier("image_view", "id", packageName));
                view.setTag(holder);
            } else {
                holder = (ItemViewHolder) view.getTag();
            }

            final int index = result.size() - 1 - position;
            holder.textView.setText(result.get(index));
            holder.imageView.setBackgroundResource(resources.getIdentifier("delete", "drawable", packageName));
            holder.imageView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(final View view) {
                    result.remove(index);
                    notifyDataSetChanged();
                }
            });
            return view;
        }

        class ItemViewHolder {
            public TextView textView;
            public ImageView imageView;
        }
    }

    private Resources resources;
    private String packageName;
    private ZXingScannerView scannerView;
    private ResultAdapter adapter;
    private final ArrayList<String> result = new ArrayList<String>();
    private TextView tvCount;


    @Override
    public void onCreate(final Bundle state) {
        super.onCreate(state);
        final String strCodes = getIntent().getStringExtra(BarcodeScanner.SCANNED_CODES);
        final String[] codes = strCodes.split(",");
        for (final String code: codes) {
            if (code != null && !code.trim().isEmpty()) {
                result.add(code.trim());
            }
        }
        resources = getApplication().getResources();
        packageName = getApplication().getPackageName();
        setContentView(resources.getIdentifier("multipe_scan_layout", "layout", packageName));
        final ViewGroup contentFrame = (ViewGroup) findViewById(resources.getIdentifier("fl_scanner", "id", packageName));
        scannerView = new ZXingScannerView(this);
        final ListView listView = (ListView) findViewById(resources.getIdentifier("rv_result", "id", packageName));
        tvCount = (TextView) findViewById(resources.getIdentifier("tv_result_count", "id", packageName));
        contentFrame.addView(scannerView);

        adapter = new ResultAdapter(this);
        listView.setAdapter(adapter);

        final ImageView ivBack = (ImageView) findViewById(resources.getIdentifier("iv_back", "id", packageName));
        ivBack.setBackgroundResource(resources.getIdentifier("back", "drawable", packageName));
        ivBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        final TextView tvConfirm = (TextView) findViewById(resources.getIdentifier("tv_confirm", "id", packageName));
        tvConfirm.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                final Intent intent = new Intent();
                intent.putStringArrayListExtra(BarcodeScanner.MULTIPLE_KEY, result);
                setResult(RESULT_OK, intent);
                finish();
            }
        });
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
        final String value = result.getText();
        if (!this.result.contains(value)) {
            this.result.add(value);
            adapter.notifyDataSetChanged();
        }

        // Note:
        // * Wait 2 seconds to resume the preview.
        // * On older devices continuously stopping and resuming camera preview can result in freezing the app.
        // * I don't know why this is the case but I don't have the time to figure out.
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                scannerView.resumeCameraPreview(MultipeScanActivity.this);
            }
        }, 500);
    }
}