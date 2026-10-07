import React, {useEffect, useState} from 'react';

type Output = {status: string; model?: string; version?: string; predicted_class?: string; scores?: Record<string, number>; error?: string};
type Results = Record<'structured' | 'image', Output>;
export function LiveAssessmentView() {
  const [mode, setMode] = useState('both');
  const [names, setNames] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string,string>>({});
  const [file, setFile] = useState<File|null>(null);
  const [health, setHealth] = useState<Record<string,{loaded:boolean; error?:string}>>({});
  const [result, setResult] = useState<Results|null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  async function connect() {
    try {
      const [s,h] = await Promise.all([fetch('/api/schema'),fetch('/api/health')]);
      if (!s.ok || !h.ok) throw new Error('Inference service unavailable');
      const schema = await s.json(); const status = await h.json();
      if (!Array.isArray(schema.features) || schema.features.length !== 23) throw new Error('Invalid model schema');
      setNames(schema.features);setHealth(status.models);setError('');
    } catch {setError('Cannot reach the inference service. Start the Python backend, then retry.');}
  }
  useEffect(()=>{void connect();},[]);
  function changed() {setResult(null);setError('');}
  async function submit(e: React.FormEvent) {
    e.preventDefault();setError('');setResult(null);
    if (mode !== 'image_only' && (!confirmed || names.length !== 23 || names.some(n=>values[n]?.trim()==='' || values[n]===undefined || !Number.isFinite(Number(values[n]))))) {
      setError('Enter all 23 training-encoded values and confirm their encoding.');return;
    }
    if (mode !== 'patient_only' && (!file || !['image/png','image/jpeg'].includes(file.type) || file.size>10*1024*1024)) {
      setError('Choose a PNG or JPEG CT export of at most 10 MB.');return;
    }
    const body=new FormData();body.append('mode',mode);
    if(mode!=='image_only')body.append('features',JSON.stringify(Object.fromEntries(names.map(n=>[n,Number(values[n])]))));
    if(mode!=='patient_only' && file)body.append('image',file);
    setBusy(true);
    try {
      const response=await fetch('/api/predict',{method:'POST',body,signal:AbortSignal.timeout(120000)});
      const data=await response.json();
      if(!response.ok)throw new Error(typeof data.detail==='string'?data.detail:'Input validation failed');
      setResult(data);
    } catch(e) {setError(e instanceof Error?e.message:'Prediction request failed');}
    finally {setBusy(false);}
  }
  return <div className="max-w-5xl mx-auto space-y-6">
    <div><h2 className="text-2xl font-semibold">Model assessment</h2><p className="mt-2">Random Forest structured classification and EfficientNetB0 CT image classification. Outputs are independent research model scores.</p></div>
    <div className="bg-white border rounded-xl p-4">
      {['structured','image'].map(b=><p key={b}>{b === 'structured'?'Random Forest':'EfficientNetB0'}: {health[b]?.loaded?'Loaded':health[b]?.error || 'Not connected'}</p>)}
      <button type="button" onClick={connect} disabled={busy} className="underline mt-2">Retry connection</button>
    </div>
    <form onSubmit={submit} className="space-y-5">
      <fieldset disabled={busy} className="space-y-5">
        <label className="block">Input mode <select className="border rounded p-2 ml-2" value={mode} onChange={e=>{setMode(e.target.value);changed();}}>
          <option value="both">Both models</option><option value="patient_only">Structured data only</option><option value="image_only">CT image only</option>
        </select></label>
        {mode!=='image_only' && <div className="bg-white border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold">Original training features</h3>
          <p>Use the numeric codes from the training CSV. Do not substitute pack-years, symptom duration or other clinical units for encoded categories. The original encoding guide is still required.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{names.map(n=><label className="text-sm" key={n}>{n}<input required type="number" step="any" className="block border rounded p-2 w-full mt-1" value={values[n]??''} onChange={e=>{setValues(v=>({...v,[n]:e.target.value}));changed();}}/></label>)}</div>
          <label className="block"><input type="checkbox" checked={confirmed} onChange={e=>{setConfirmed(e.target.checked);changed();}}/> I have verified these values against the original training encoding.</label>
        </div>}
        {mode!=='patient_only' && <label className="block bg-white border rounded-xl p-5">Single CT image export (PNG/JPEG, maximum 10 MB)
          <input className="block mt-3" type="file" accept="image/png,image/jpeg" required onChange={e=>{setFile(e.target.files?.[0]??null);changed();}}/>
          <span className="block text-sm mt-2">DICOM volumes and chest X-rays are not supported. The service converts to RGB and resizes to 224 × 224.</span>
        </label>}
        <button className="bg-[#245C45] text-white px-6 py-3 rounded-xl" type="submit">{busy?'Running models…':'Run model assessment'}</button>
      </fieldset>
    </form>
    {error && <p role="alert" className="text-red-700 bg-red-50 p-4 rounded">{error}</p>}
    {result && <div aria-live="polite" className="grid md:grid-cols-2 gap-5">{(['structured','image'] as const).map(b=>{
      const r=result[b];return <section key={b} className="bg-white border rounded-xl p-5 space-y-3">
        <h3 className="font-semibold">{b==='structured'?'Random Forest':'EfficientNetB0'}</h3>
        {r.status==='available'?<><p className="text-xl">{r.predicted_class}</p><p className="text-xs">Artifact: {r.version}</p>
          <ul>{Object.entries(r.scores??{}).map(([label,score])=><li className="flex justify-between py-1" key={label}><span>{label}</span><span>{(score*100).toFixed(2)}%</span></li>)}</ul>
          <p className="text-sm">Class scores are not calibrated patient cancer probabilities. No combined score or fabricated explanation is produced.</p></>
          :<p>{r.status==='not_included'?'Not evaluated for this input mode':r.error || 'Model unavailable'}</p>}
      </section>;
    })}</div>}
  </div>;
}
