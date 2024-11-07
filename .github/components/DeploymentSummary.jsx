// .github/components/DeploymentSummary.jsx

import React from 'react';
import { CheckCircle, XCircle, GitBranch, Key, Code, Upload, Globe, ArrowRight } from 'lucide-react';

export default function DeploymentSummary({ 
  proxyName,
  version,
  deployedEnvironments,
  authResult,
  lintResult,
  uploadResult,
  deployResults,
  timestamp
}) {
  import React from 'react';
import { CheckCircle, XCircle, GitBranch, Key, Code, Upload, Globe, ArrowRight } from 'lucide-react';

export default function DeploymentSummary({ 
  proxyName = "WeatherForecastAPI",
  version = "12",
  deployedEnvironments = ["dev", "test", "uat"],
  authResult = "success",
  lintResult = "success",
  uploadResult = "success",
  deployResults = { dev: "success", test: "success", uat: "pending" },
  timestamp = new Date().toLocaleString()
}) {
  const StatusIcon = ({ status }) => {
    switch(status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />;
    }
  };

  const StepCard = ({ icon: Icon, title, status, details }) => (
    <div className={`rounded-lg shadow-lg p-6 ${
      status === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 
      status === 'failed' ? 'bg-red-50 border-l-4 border-red-500' :
      'bg-gray-50 border-l-4 border-gray-500'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${
            status === 'success' ? 'text-green-500' : 
            status === 'failed' ? 'text-red-500' :
            'text-gray-500'
          }`} />
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        </div>
        <StatusIcon status={status} />
      </div>
      {details && (
        <div className="mt-2 text-sm text-gray-600">
          {details}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <GitBranch className="w-6 h-6" />
              Apigee Deployment Pipeline
            </h1>
            <p className="text-blue-100 mt-2">Proxy: {proxyName} (v{version})</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100">Deployment Time</p>
            <p className="text-white font-medium">{timestamp}</p>
          </div>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="space-y-4">
        <StepCard 
          icon={Key}
          title="Authentication"
          status={authResult}
          details="GCP Workload Identity Authentication"
        />

        <div className="flex justify-center">
          <ArrowRight className="text-gray-400 w-6 h-6" />
        </div>

        <StepCard 
          icon={Code}
          title="Linting Check"
          status={lintResult}
          details="Apigeelint Policy Validation"
        />

        <div className="flex justify-center">
          <ArrowRight className="text-gray-400 w-6 h-6" />
        </div>

        <StepCard 
          icon={Upload}
          title="Proxy Upload"
          status={uploadResult}
          details={uploadResult === 'success' ? `Successfully uploaded version ${version}` : "Failed to upload proxy bundle"}
        />

        <div className="flex justify-center">
          <ArrowRight className="text-gray-400 w-6 h-6" />
        </div>

        <StepCard 
          icon={Globe}
          title="Environment Deployments"
          status={Object.values(deployResults).every(r => r === 'success') ? 'success' : 'pending'}
          details={
            <div className="grid grid-cols-3 gap-4 mt-3">
              {deployedEnvironments.map(env => (
                <div key={env} className="flex items-center justify-between p-2 bg-white rounded shadow-sm">
                  <span className="text-gray-700 font-medium">{env}</span>
                  <StatusIcon status={deployResults[env]} />
                </div>
              ))}
            </div>
          }
        />
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Overall Status</span>
          <div className="flex items-center gap-2">
            {Object.values(deployResults).every(r => r === 'success') &&
             authResult === 'success' &&
             lintResult === 'success' &&
             uploadResult === 'success' ? (
              <>
                <span className="text-green-600 font-medium">Successfully Deployed</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </>
            ) : (
              <>
                <span className="text-yellow-600 font-medium">Deployment In Progress</span>
                <div className="w-5 h-5 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
}
