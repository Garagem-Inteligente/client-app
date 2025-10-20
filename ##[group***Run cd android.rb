##[group***Run cd android
cd android
chmod +x ./gradlew
./gradlew bundleRelease --no-daemon --stacktrace
shell: /usr/bin/bash -e ***0***
env:
  NODE_VERSION: 20
  JAVA_VERSION: 21
  PNPM_HOME: /home/runner/setup-pnpm/node_modules/.bin
  JAVA_HOME: /opt/hostedtoolcache/Java_Temurin-Hotspot_jdk/21.0.8-9/x64
  JAVA_HOME_21_X64: /opt/hostedtoolcache/Java_Temurin-Hotspot_jdk/21.0.8-9/x64
##[endgroup***
Downloading https://services.gradle.org/distributions/gradle-8.11.1-all.zip
.....................10%......................20%......................30%......................40%......................50%......................60%......................70%......................80%......................90%......................100%
Welcome to Gradle 8.11.1!
Here are the highlights of this release:
 - Parallel load and store for Configuration Cache
 - Java compilation errors at the end of the build output
 - Consolidated report for warnings and deprecations
For more details see https://docs.gradle.org/8.11.1/release-notes.html
To honour the JVM settings for this build a single-use Daemon process will be forked. For more on this, please refer to https://docs.gradle.org/8.11.1/userguide/gradle_daemon.html#sec:disabling_the_daemon in the Gradle documentation.
Daemon will be stopped at the end of the build 
> Configure project :app
WARNING: Using flatDir should be avoided because it doesn't support any meta-data formats.
> Configure project :capacitor-cordova-android-plugins
WARNING: Using flatDir should be avoided because it doesn't support any meta-data formats.
> Task :app:preBuild UP-TO-DATE
> Task :app:preReleaseBuild UP-TO-DATE
> Task :app:generateReleaseResValues
> Task :app:processReleaseGoogleServices
> Task :capacitor-android:preBuild UP-TO-DATE
> Task :capacitor-android:preReleaseBuild UP-TO-DATE
> Task :capacitor-android:generateReleaseResValues
> Task :capacitor-android:generateReleaseResources
> Task :capacitor-android:packageReleaseResources
> Task :capacitor-app:preBuild UP-TO-DATE
> Task :capacitor-app:preReleaseBuild UP-TO-DATE
> Task :capacitor-app:generateReleaseResValues
> Task :capacitor-app:generateReleaseResources
> Task :capacitor-app:packageReleaseResources
> Task :capacitor-camera:preBuild UP-TO-DATE
> Task :capacitor-camera:preReleaseBuild UP-TO-DATE
> Task :capacitor-camera:generateReleaseResValues
> Task :capacitor-camera:generateReleaseResources
> Task :capacitor-camera:packageReleaseResources
> Task :capacitor-cordova-android-plugins:preBuild UP-TO-DATE
> Task :capacitor-cordova-android-plugins:preReleaseBuild UP-TO-DATE
> Task :capacitor-cordova-android-plugins:generateReleaseResValues
> Task :capacitor-cordova-android-plugins:generateReleaseResources
> Task :capacitor-cordova-android-plugins:packageReleaseResources
> Task :capacitor-device:preBuild UP-TO-DATE
> Task :capacitor-device:preReleaseBuild UP-TO-DATE
> Task :capacitor-device:generateReleaseResValues
> Task :capacitor-device:generateReleaseResources
> Task :capacitor-device:packageReleaseResources
> Task :capacitor-geolocation:preBuild UP-TO-DATE
> Task :capacitor-geolocation:preReleaseBuild UP-TO-DATE
> Task :capacitor-geolocation:generateReleaseResValues
> Task :capacitor-geolocation:generateReleaseResources
> Task :capacitor-geolocation:packageReleaseResources
> Task :capacitor-haptics:preBuild UP-TO-DATE
> Task :capacitor-haptics:preReleaseBuild UP-TO-DATE
> Task :capacitor-haptics:generateReleaseResValues
> Task :capacitor-haptics:generateReleaseResources
> Task :capacitor-haptics:packageReleaseResources
> Task :capacitor-keyboard:preBuild UP-TO-DATE
> Task :capacitor-keyboard:preReleaseBuild UP-TO-DATE
> Task :capacitor-keyboard:generateReleaseResValues
> Task :capacitor-keyboard:generateReleaseResources
> Task :capacitor-keyboard:packageReleaseResources
> Task :capacitor-network:preBuild UP-TO-DATE
> Task :capacitor-network:preReleaseBuild UP-TO-DATE
> Task :capacitor-network:generateReleaseResValues
> Task :capacitor-network:generateReleaseResources
> Task :capacitor-network:packageReleaseResources
> Task :capacitor-push-notifications:preBuild UP-TO-DATE
> Task :capacitor-push-notifications:preReleaseBuild UP-TO-DATE
> Task :capacitor-push-notifications:generateReleaseResValues
> Task :capacitor-push-notifications:generateReleaseResources
> Task :capacitor-push-notifications:packageReleaseResources
> Task :capacitor-status-bar:preBuild UP-TO-DATE
> Task :capacitor-status-bar:preReleaseBuild UP-TO-DATE
> Task :capacitor-status-bar:generateReleaseResValues
> Task :capacitor-status-bar:generateReleaseResources
> Task :capacitor-status-bar:packageReleaseResources
> Task :capgo-capacitor-social-login:preBuild UP-TO-DATE
> Task :capgo-capacitor-social-login:preReleaseBuild UP-TO-DATE
> Task :capgo-capacitor-social-login:generateReleaseResValues
> Task :capgo-capacitor-social-login:generateReleaseResources
> Task :capgo-capacitor-social-login:packageReleaseResources
> Task :app:mapReleaseSourceSetPaths
> Task :app:generateReleaseResources
> Task :app:createReleaseCompatibleScreenManifests
> Task :app:extractDeepLinksRelease
> Task :capacitor-android:extractDeepLinksRelease
> Task :capacitor-app:extractDeepLinksRelease
> Task :capacitor-android:processReleaseManifest
> Task :capacitor-app:processReleaseManifest
> Task :capacitor-camera:extractDeepLinksRelease
> Task :capacitor-cordova-android-plugins:extractDeepLinksRelease
> Task :capacitor-camera:processReleaseManifest
> Task :capacitor-device:extractDeepLinksRelease
> Task :capacitor-cordova-android-plugins:processReleaseManifest
> Task :capacitor-geolocation:extractDeepLinksRelease
> Task :capacitor-device:processReleaseManifest
> Task :capacitor-haptics:extractDeepLinksRelease
> Task :capacitor-geolocation:processReleaseManifest
> Task :capacitor-haptics:processReleaseManifest
> Task :capacitor-keyboard:extractDeepLinksRelease
> Task :capacitor-network:extractDeepLinksRelease
> Task :capacitor-keyboard:processReleaseManifest
> Task :capacitor-network:processReleaseManifest
> Task :capacitor-push-notifications:extractDeepLinksRelease
> Task :capacitor-status-bar:extractDeepLinksRelease
> Task :capgo-capacitor-social-login:extractDeepLinksRelease
> Task :capacitor-status-bar:processReleaseManifest
> Task :capacitor-push-notifications:processReleaseManifest
> Task :capgo-capacitor-social-login:processReleaseManifest
/home/runner/work/client-app/client-app/node_modules/.pnpm/@capgo+capacitor-social-login@7.11.21_@capacitor+core@7.4.3/node_modules/@capgo/capacitor-social-login/android/src/main/AndroidManifest.xml:11:9-15:35 Warning:
	provider#com.facebook.internal.FacebookInitProvider was tagged at AndroidManifest.xml:11 to remove other declarations but no other declaration present
> Task :capacitor-app:writeReleaseAarMetadata
> Task :capacitor-android:writeReleaseAarMetadata
> Task :app:mergeReleaseResources
> Task :app:processReleaseMainManifest
> Task :app:processReleaseManifest
> Task :app:processApplicationManifestReleaseForBundle
> Task :capacitor-camera:writeReleaseAarMetadata
> Task :capacitor-cordova-android-plugins:writeReleaseAarMetadata
> Task :capacitor-device:writeReleaseAarMetadata
> Task :capacitor-geolocation:writeReleaseAarMetadata
> Task :capacitor-haptics:writeReleaseAarMetadata
> Task :capacitor-keyboard:writeReleaseAarMetadata
> Task :capacitor-network:writeReleaseAarMetadata
> Task :capacitor-push-notifications:writeReleaseAarMetadata
> Task :capacitor-status-bar:writeReleaseAarMetadata
> Task :capgo-capacitor-social-login:writeReleaseAarMetadata
> Task :app:packageReleaseResources
> Task :app:checkReleaseAarMetadata
> Task :app:processReleaseManifestForPackage
> Task :capacitor-android:compileReleaseLibraryResources
> Task :capacitor-app:compileReleaseLibraryResources
> Task :capacitor-android:parseReleaseLocalResources
> Task :app:parseReleaseLocalResources
> Task :capacitor-camera:compileReleaseLibraryResources
> Task :capacitor-app:parseReleaseLocalResources
> Task :capacitor-cordova-android-plugins:compileReleaseLibraryResources
> Task :capacitor-camera:parseReleaseLocalResources
> Task :capacitor-cordova-android-plugins:parseReleaseLocalResources
> Task :capacitor-android:generateReleaseRFile
> Task :capacitor-app:generateReleaseRFile
> Task :capacitor-camera:generateReleaseRFile
> Task :capacitor-cordova-android-plugins:generateReleaseRFile
> Task :capacitor-device:compileReleaseLibraryResources
> Task :capacitor-geolocation:compileReleaseLibraryResources
> Task :capacitor-device:parseReleaseLocalResources
> Task :capacitor-geolocation:parseReleaseLocalResources
> Task :capacitor-device:generateReleaseRFile
> Task :capacitor-haptics:compileReleaseLibraryResources
> Task :capacitor-geolocation:generateReleaseRFile
> Task :capacitor-haptics:parseReleaseLocalResources
> Task :capacitor-keyboard:compileReleaseLibraryResources
> Task :capacitor-haptics:generateReleaseRFile
> Task :capacitor-network:compileReleaseLibraryResources
> Task :capacitor-keyboard:parseReleaseLocalResources
> Task :capacitor-push-notifications:compileReleaseLibraryResources
> Task :capacitor-network:parseReleaseLocalResources
> Task :capacitor-network:generateReleaseRFile
> Task :capacitor-keyboard:generateReleaseRFile
> Task :capacitor-push-notifications:parseReleaseLocalResources
> Task :capacitor-status-bar:compileReleaseLibraryResources
> Task :capacitor-push-notifications:generateReleaseRFile
> Task :capacitor-status-bar:parseReleaseLocalResources
> Task :capgo-capacitor-social-login:compileReleaseLibraryResources
> Task :capgo-capacitor-social-login:parseReleaseLocalResources
> Task :capacitor-status-bar:generateReleaseRFile
> Task :app:extractReleaseVersionControlInfo
> Task :capgo-capacitor-social-login:generateReleaseRFile
> Task :capacitor-android:javaPreCompileRelease
> Task :app:processReleaseResources
> Task :capacitor-android:compileReleaseJavaWithJavac
Note: Some input files use unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
> Task :capacitor-app:javaPreCompileRelease
> Task :capacitor-camera:javaPreCompileRelease
> Task :capacitor-device:javaPreCompileRelease
> Task :capacitor-geolocation:checkKotlinGradlePluginConfigurationErrors
> Task :capacitor-geolocation:javaPreCompileRelease
> Task :capacitor-haptics:javaPreCompileRelease
> Task :capacitor-keyboard:javaPreCompileRelease
> Task :capacitor-network:javaPreCompileRelease
> Task :capacitor-android:bundleLibCompileToJarRelease
> Task :capacitor-android:bundleLibRuntimeToJarRelease
> Task :capacitor-push-notifications:javaPreCompileRelease
> Task :capacitor-app:compileReleaseJavaWithJavac
> Task :app:bundleReleaseResources
> Task :capacitor-app:bundleLibRuntimeToJarRelease
Note: /home/runner/work/client-app/client-app/node_modules/.pnpm/@capacitor+camera@7.0.2_@capacitor+core@7.4.3/node_modules/@capacitor/camera/android/src/main/java/com/capacitorjs/plugins/camera/CameraBottomSheetDialogFragment.java uses unchecked or unsafe operations.
Note: Recompile with -Xlint:unchecked for details.
> Task :capacitor-camera:compileReleaseJavaWithJavac
> Task :capacitor-camera:bundleLibRuntimeToJarRelease
> Task :capacitor-device:compileReleaseJavaWithJavac
> Task :capacitor-device:bundleLibRuntimeToJarRelease
> Task :capacitor-geolocation:compileReleaseKotlin FAILED
[Incubating*** Problems report is available at: file:///home/runner/work/client-app/client-app/android/build/reports/problems/problems-report.html
FAILURE: Build failed with an exception.
* What went wrong:
Execution failed for task ':capacitor-geolocation:compileReleaseKotlin'.
> Inconsistent JVM-target compatibility detected for tasks 'compileReleaseJavaWithJavac' (17) and 'compileReleaseKotlin' (21).
  
  Consider using JVM Toolchain: https://kotl.in/gradle/jvm/toolchain
  Learn more about JVM-target validation: https://kotl.in/gradle/jvm/target-validation 
* Try:
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.
> Get more help at https://help.gradle.org.
* Exception is:
org.gradle.api.tasks.TaskExecutionException: Execution failed for task ':capacitor-geolocation:compileReleaseKotlin'.
	at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.lambda$executeIfValid$1(ExecuteActionsTaskExecuter.java:130)
	at org.gradle.internal.Try$Failure.ifSuccessfulOrElse(Try.java:293)
	at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.executeIfValid(ExecuteActionsTaskExecuter.java:128)
	at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.execute(ExecuteActionsTaskExecuter.java:116)
	at org.gradle.api.internal.tasks.execution.FinalizePropertiesTaskExecuter.execute(FinalizePropertiesTaskExecuter.java:46)
	at org.gradle.api.internal.tasks.execution.ResolveTaskExecutionModeExecuter.execute(ResolveTaskExecutionModeExecuter.java:51)
	at org.gradle.api.internal.tasks.execution.SkipTaskWithNoActionsExecuter.execute(SkipTaskWithNoActionsExecuter.java:57)
	at org.gradle.api.internal.tasks.execution.SkipOnlyIfTaskExecuter.execute(SkipOnlyIfTaskExecuter.java:74)
	at org.gradle.api.internal.tasks.execution.CatchExceptionTaskExecuter.execute(CatchExceptionTaskExecuter.java:36)
	at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter$1.executeTask(EventFiringTaskExecuter.java:77)
	at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter$1.call(EventFiringTaskExecuter.java:55)
	at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter$1.call(EventFiringTaskExecuter.java:52)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:209)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:204)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:166)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
	at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter.execute(EventFiringTaskExecuter.java:52)
	at org.gradle.execution.plan.LocalTaskNodeExecutor.execute(LocalTaskNodeExecutor.java:42)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$InvokeNodeExecutorsAction.execute(DefaultTaskExecutionGraph.java:331)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$InvokeNodeExecutorsAction.execute(DefaultTaskExecutionGraph.java:318)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$BuildOperationAwareExecutionAction.lambda$execute$0(DefaultTaskExecutionGraph.java:314)
	at org.gradle.internal.operations.CurrentBuildOperationRef.with(CurrentBuildOperationRef.java:85)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$BuildOperationAwareExecutionAction.execute(DefaultTaskExecutionGraph.java:314)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$BuildOperationAwareExecutionAction.execute(DefaultTaskExecutionGraph.java:303)
	at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker.execute(DefaultPlanExecutor.java:459)
	at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker.run(DefaultPlanExecutor.java:376)
	at org.gradle.execution.plan.DefaultPlanExecutor.process(DefaultPlanExecutor.java:111)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph.executeWithServices(DefaultTaskExecutionGraph.java:138)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph.execute(DefaultTaskExecutionGraph.java:123)
	at org.gradle.execution.SelectedTaskExecutionAction.execute(SelectedTaskExecutionAction.java:35)
	at org.gradle.execution.DryRunBuildExecutionAction.execute(DryRunBuildExecutionAction.java:51)
	at org.gradle.execution.BuildOperationFiringBuildWorkerExecutor$ExecuteTasks.call(BuildOperationFiringBuildWorkerExecutor.java:54)
	at org.gradle.execution.BuildOperationFiringBuildWorkerExecutor$ExecuteTasks.call(BuildOperationFiringBuildWorkerExecutor.java:43)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:209)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:204)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:166)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
	at org.gradle.execution.BuildOperationFiringBuildWorkerExecutor.execute(BuildOperationFiringBuildWorkerExecutor.java:40)
	at org.gradle.internal.build.DefaultBuildLifecycleController.lambda$executeTasks$10(DefaultBuildLifecycleController.java:313)
	at org.gradle.internal.model.StateTransitionController.doTransition(StateTransitionController.java:266)
	at org.gradle.internal.model.StateTransitionController.lambda$tryTransition$8(StateTransitionController.java:177)
	at org.gradle.internal.work.DefaultSynchronizer.withLock(DefaultSynchronizer.java:46)
	at org.gradle.internal.model.StateTransitionController.tryTransition(StateTransitionController.java:177)
	at org.gradle.internal.build.DefaultBuildLifecycleController.executeTasks(DefaultBuildLifecycleController.java:304)
	at org.gradle.internal.build.DefaultBuildWorkGraphController$DefaultBuildWorkGraph.runWork(DefaultBuildWorkGraphController.java:220)
	at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:263)
	at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:127)
	at org.gradle.composite.internal.DefaultBuildController.doRun(DefaultBuildController.java:181)
	at org.gradle.composite.internal.DefaultBuildController.access$000(DefaultBuildController.java:50)
	at org.gradle.composite.internal.DefaultBuildController$BuildOpRunnable.lambda$run$0(DefaultBuildController.java:198)
	at org.gradle.internal.operations.CurrentBuildOperationRef.with(CurrentBuildOperationRef.java:85)
	at org.gradle.composite.internal.DefaultBuildController$BuildOpRunnable.run(DefaultBuildController.java:198)
	at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
	at org.gradle.internal.concurrent.AbstractManagedExecutor$1.run(AbstractManagedExecutor.java:48)
Caused by: org.gradle.api.InvalidUserCodeException: Inconsistent JVM-target compatibility detected for tasks 'compileReleaseJavaWithJavac' (17) and 'compileReleaseKotlin' (21).
Consider using JVM Toolchain: https://kotl.in/gradle/jvm/toolchain
Learn more about JVM-target validation: https://kotl.in/gradle/jvm/target-validation 
	at org.jetbrains.kotlin.gradle.plugin.diagnostics.RenderReportedDiagnosticsKt.createAnExceptionForFatalDiagnostic(renderReportedDiagnostics.kt:44)
	at org.jetbrains.kotlin.gradle.plugin.diagnostics.RenderReportedDiagnosticsKt.renderReportedDiagnostic(renderReportedDiagnostics.kt:32)
	at org.jetbrains.kotlin.gradle.plugin.diagnostics.KotlinToolingDiagnosticsCollector.report(KotlinToolingDiagnosticsCollector.kt:41)
	at org.jetbrains.kotlin.gradle.plugin.diagnostics.UsesKotlinToolingDiagnostics$DefaultImpls.reportDiagnostic(UsesKotlinToolingDiagnostics.kt:20)
	at org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile.reportDiagnostic(AbstractKotlinCompile.kt:48)
	at org.jetbrains.kotlin.gradle.tasks.KotlinCompile.validateKotlinAndJavaHasSameTargetCompatibility(KotlinCompile.kt:378)
	at org.jetbrains.kotlin.gradle.tasks.KotlinCompile.callCompilerAsync$kotlin_gradle_plugin_common(KotlinCompile.kt:310)
	at org.jetbrains.kotlin.gradle.tasks.KotlinCompile.callCompilerAsync$kotlin_gradle_plugin_common(KotlinCompile.kt:56)
	at org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile.executeImpl(AbstractKotlinCompile.kt:324)
	at org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile.execute(AbstractKotlinCompile.kt:274)
	at java.base/jdk.internal.reflect.DirectMethodHandleAccessor.invoke(DirectMethodHandleAccessor.java:103)
	at org.gradle.internal.reflect.JavaMethod.invoke(JavaMethod.java:125)
	at org.gradle.api.internal.project.taskfactory.IncrementalTaskAction.doExecute(IncrementalTaskAction.java:45)
	at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:51)
	at org.gradle.api.internal.project.taskfactory.IncrementalTaskAction.execute(IncrementalTaskAction.java:26)
	at org.gradle.api.internal.project.taskfactory.StandardTaskAction.execute(StandardTaskAction.java:29)
	at org.gradle.api.internal.tasks.execution.TaskExecution$3.run(TaskExecution.java:244)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:29)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$1.execute(DefaultBuildOperationRunner.java:26)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:166)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.run(DefaultBuildOperationRunner.java:47)
	at org.gradle.api.internal.tasks.execution.TaskExecution.executeAction(TaskExecution.java:229)
	at org.gradle.api.internal.tasks.execution.TaskExecution.executeActions(TaskExecution.java:212)
	at org.gradle.api.internal.tasks.execution.TaskExecution.executeWithPreviousOutputFiles(TaskExecution.java:195)
	at org.gradle.api.internal.tasks.execution.TaskExecution.execute(TaskExecution.java:162)
	at org.gradle.internal.execution.steps.ExecuteStep.executeInternal(ExecuteStep.java:105)
	at org.gradle.internal.execution.steps.ExecuteStep.access$000(ExecuteStep.java:44)
	at org.gradle.internal.execution.steps.ExecuteStep$1.call(ExecuteStep.java:59)
	at org.gradle.internal.execution.steps.ExecuteStep$1.call(ExecuteStep.java:56)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:209)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:204)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:166)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
	at org.gradle.internal.execution.steps.ExecuteStep.execute(ExecuteStep.java:56)
	at org.gradle.internal.execution.steps.ExecuteStep.execute(ExecuteStep.java:44)
	at org.gradle.internal.execution.steps.CancelExecutionStep.execute(CancelExecutionStep.java:42)
	at org.gradle.internal.execution.steps.TimeoutStep.executeWithoutTimeout(TimeoutStep.java:75)
	at org.gradle.internal.execution.steps.TimeoutStep.execute(TimeoutStep.java:55)
	at org.gradle.internal.execution.steps.PreCreateOutputParentsStep.execute(PreCreateOutputParentsStep.java:50)
	at org.gradle.internal.execution.steps.PreCreateOutputParentsStep.execute(PreCreateOutputParentsStep.java:28)
	at org.gradle.internal.execution.steps.RemovePreviousOutputsStep.execute(RemovePreviousOutputsStep.java:67)
	at org.gradle.internal.execution.steps.RemovePreviousOutputsStep.execute(RemovePreviousOutputsStep.java:37)
	at org.gradle.internal.execution.steps.BroadcastChangingOutputsStep.execute(BroadcastChangingOutputsStep.java:61)
	at org.gradle.internal.execution.steps.BroadcastChangingOutputsStep.execute(BroadcastChangingOutputsStep.java:26)
	at org.gradle.internal.execution.steps.CaptureOutputsAfterExecutionStep.execute(CaptureOutputsAfterExecutionStep.java:69)
	at org.gradle.internal.execution.steps.CaptureOutputsAfterExecutionStep.execute(CaptureOutputsAfterExecutionStep.java:46)
	at org.gradle.internal.execution.steps.ResolveInputChangesStep.execute(ResolveInputChangesStep.java:40)
	at org.gradle.internal.execution.steps.ResolveInputChangesStep.execute(ResolveInputChangesStep.java:29)
	at org.gradle.internal.execution.steps.BuildCacheStep.executeWithoutCache(BuildCacheStep.java:189)
	at org.gradle.internal.execution.steps.BuildCacheStep.lambda$execute$1(BuildCacheStep.java:75)
	at org.gradle.internal.Either$Right.fold(Either.java:175)
	at org.gradle.internal.execution.caching.CachingState.fold(CachingState.java:62)
	at org.gradle.internal.execution.steps.BuildCacheStep.execute(BuildCacheStep.java:73)
	at org.gradle.internal.execution.steps.BuildCacheStep.execute(BuildCacheStep.java:48)
	at org.gradle.internal.execution.steps.StoreExecutionStateStep.execute(StoreExecutionStateStep.java:46)
	at org.gradle.internal.execution.steps.StoreExecutionStateStep.execute(StoreExecutionStateStep.java:35)
	at org.gradle.internal.execution.steps.SkipUpToDateStep.executeBecause(SkipUpToDateStep.java:75)
	at org.gradle.internal.execution.steps.SkipUpToDateStep.lambda$execute$2(SkipUpToDateStep.java:53)
	at org.gradle.internal.execution.steps.SkipUpToDateStep.execute(SkipUpToDateStep.java:53)
	at org.gradle.internal.execution.steps.SkipUpToDateStep.execute(SkipUpToDateStep.java:35)
	at org.gradle.internal.execution.steps.legacy.MarkSnapshottingInputsFinishedStep.execute(MarkSnapshottingInputsFinishedStep.java:37)
	at org.gradle.internal.execution.steps.legacy.MarkSnapshottingInputsFinishedStep.execute(MarkSnapshottingInputsFinishedStep.java:27)
	at org.gradle.internal.execution.steps.ResolveIncrementalCachingStateStep.executeDelegate(ResolveIncrementalCachingStateStep.java:49)
	at org.gradle.internal.execution.steps.ResolveIncrementalCachingStateStep.executeDelegate(ResolveIncrementalCachingStateStep.java:27)
	at org.gradle.internal.execution.steps.AbstractResolveCachingStateStep.execute(AbstractResolveCachingStateStep.java:71)
	at org.gradle.internal.execution.steps.AbstractResolveCachingStateStep.execute(AbstractResolveCachingStateStep.java:39)
	at org.gradle.internal.execution.steps.ResolveChangesStep.execute(ResolveChangesStep.java:65)
	at org.gradle.internal.execution.steps.ResolveChangesStep.execute(ResolveChangesStep.java:36)
	at org.gradle.internal.execution.steps.ValidateStep.execute(ValidateStep.java:107)
	at org.gradle.internal.execution.steps.ValidateStep.execute(ValidateStep.java:56)
	at org.gradle.internal.execution.steps.AbstractCaptureStateBeforeExecutionStep.execute(AbstractCaptureStateBeforeExecutionStep.java:64)
	at org.gradle.internal.execution.steps.AbstractCaptureStateBeforeExecutionStep.execute(AbstractCaptureStateBeforeExecutionStep.java:43)
	at org.gradle.internal.execution.steps.AbstractSkipEmptyWorkStep.executeWithNonEmptySources(AbstractSkipEmptyWorkStep.java:125)
	at org.gradle.internal.execution.steps.AbstractSkipEmptyWorkStep.execute(AbstractSkipEmptyWorkStep.java:61)
	at org.gradle.internal.execution.steps.AbstractSkipEmptyWorkStep.execute(AbstractSkipEmptyWorkStep.java:36)
	at org.gradle.internal.execution.steps.legacy.MarkSnapshottingInputsStartedStep.execute(MarkSnapshottingInputsStartedStep.java:38)
	at org.gradle.internal.execution.steps.LoadPreviousExecutionStateStep.execute(LoadPreviousExecutionStateStep.java:36)
	at org.gradle.internal.execution.steps.LoadPreviousExecutionStateStep.execute(LoadPreviousExecutionStateStep.java:23)
	at org.gradle.internal.execution.steps.HandleStaleOutputsStep.execute(HandleStaleOutputsStep.java:75)
	at org.gradle.internal.execution.steps.HandleStaleOutputsStep.execute(HandleStaleOutputsStep.java:41)
	at org.gradle.internal.execution.steps.AssignMutableWorkspaceStep.lambda$execute$0(AssignMutableWorkspaceStep.java:35)
	at org.gradle.api.internal.tasks.execution.TaskExecution$4.withWorkspace(TaskExecution.java:289)
	at org.gradle.internal.execution.steps.AssignMutableWorkspaceStep.execute(AssignMutableWorkspaceStep.java:31)
	at org.gradle.internal.execution.steps.AssignMutableWorkspaceStep.execute(AssignMutableWorkspaceStep.java:22)
	at org.gradle.internal.execution.steps.ChoosePipelineStep.execute(ChoosePipelineStep.java:40)
	at org.gradle.internal.execution.steps.ChoosePipelineStep.execute(ChoosePipelineStep.java:23)
	at org.gradle.internal.execution.steps.ExecuteWorkBuildOperationFiringStep.lambda$execute$2(ExecuteWorkBuildOperationFiringStep.java:67)
	at org.gradle.internal.execution.steps.ExecuteWorkBuildOperationFiringStep.execute(ExecuteWorkBuildOperationFiringStep.java:67)
	at org.gradle.internal.execution.steps.ExecuteWorkBuildOperationFiringStep.execute(ExecuteWorkBuildOperationFiringStep.java:39)
	at org.gradle.internal.execution.steps.IdentityCacheStep.execute(IdentityCacheStep.java:46)
	at org.gradle.internal.execution.steps.IdentityCacheStep.execute(IdentityCacheStep.java:34)
	at org.gradle.internal.execution.steps.IdentifyStep.execute(IdentifyStep.java:48)
	at org.gradle.internal.execution.steps.IdentifyStep.execute(IdentifyStep.java:35)
	at org.gradle.internal.execution.impl.DefaultExecutionEngine$1.execute(DefaultExecutionEngine.java:61)
	at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.executeIfValid(ExecuteActionsTaskExecuter.java:127)
	at org.gradle.api.internal.tasks.execution.ExecuteActionsTaskExecuter.execute(ExecuteActionsTaskExecuter.java:116)
	at org.gradle.api.internal.tasks.execution.FinalizePropertiesTaskExecuter.execute(FinalizePropertiesTaskExecuter.java:46)
	at org.gradle.api.internal.tasks.execution.ResolveTaskExecutionModeExecuter.execute(ResolveTaskExecutionModeExecuter.java:51)
	at org.gradle.api.internal.tasks.execution.SkipTaskWithNoActionsExecuter.execute(SkipTaskWithNoActionsExecuter.java:57)
	at org.gradle.api.internal.tasks.execution.SkipOnlyIfTaskExecuter.execute(SkipOnlyIfTaskExecuter.java:74)
	at org.gradle.api.internal.tasks.execution.CatchExceptionTaskExecuter.execute(CatchExceptionTaskExecuter.java:36)
	at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter$1.executeTask(EventFiringTaskExecuter.java:77)
	at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter$1.call(EventFiringTaskExecuter.java:55)
	at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter$1.call(EventFiringTaskExecuter.java:52)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:209)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:204)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:166)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
	at org.gradle.api.internal.tasks.execution.EventFiringTaskExecuter.execute(EventFiringTaskExecuter.java:52)
	at org.gradle.execution.plan.LocalTaskNodeExecutor.execute(LocalTaskNodeExecutor.java:42)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$InvokeNodeExecutorsAction.execute(DefaultTaskExecutionGraph.java:331)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$InvokeNodeExecutorsAction.execute(DefaultTaskExecutionGraph.java:318)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$BuildOperationAwareExecutionAction.lambda$execute$0(DefaultTaskExecutionGraph.java:314)
	at org.gradle.internal.operations.CurrentBuildOperationRef.with(CurrentBuildOperationRef.java:85)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$BuildOperationAwareExecutionAction.execute(DefaultTaskExecutionGraph.java:314)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph$BuildOperationAwareExecutionAction.execute(DefaultTaskExecutionGraph.java:303)
	at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker.execute(DefaultPlanExecutor.java:459)
	at org.gradle.execution.plan.DefaultPlanExecutor$ExecutorWorker.run(DefaultPlanExecutor.java:376)
	at org.gradle.execution.plan.DefaultPlanExecutor.process(DefaultPlanExecutor.java:111)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph.executeWithServices(DefaultTaskExecutionGraph.java:138)
	at org.gradle.execution.taskgraph.DefaultTaskExecutionGraph.execute(DefaultTaskExecutionGraph.java:123)
	at org.gradle.execution.SelectedTaskExecutionAction.execute(SelectedTaskExecutionAction.java:35)
	at org.gradle.execution.DryRunBuildExecutionAction.execute(DryRunBuildExecutionAction.java:51)
	at org.gradle.execution.BuildOperationFiringBuildWorkerExecutor$ExecuteTasks.call(BuildOperationFiringBuildWorkerExecutor.java:54)
	at org.gradle.execution.BuildOperationFiringBuildWorkerExecutor$ExecuteTasks.call(BuildOperationFiringBuildWorkerExecutor.java:43)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:209)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$CallableBuildOperationWorker.execute(DefaultBuildOperationRunner.java:204)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:66)
	at org.gradle.internal.operations.DefaultBuildOperationRunner$2.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:166)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.execute(DefaultBuildOperationRunner.java:59)
	at org.gradle.internal.operations.DefaultBuildOperationRunner.call(DefaultBuildOperationRunner.java:53)
	at org.gradle.execution.BuildOperationFiringBuildWorkerExecutor.execute(BuildOperationFiringBuildWorkerExecutor.java:40)
	at org.gradle.internal.build.DefaultBuildLifecycleController.lambda$executeTasks$10(DefaultBuildLifecycleController.java:313)
	at org.gradle.internal.model.StateTransitionController.doTransition(StateTransitionController.java:266)
	at org.gradle.internal.model.StateTransitionController.lambda$tryTransition$8(StateTransitionController.java:177)
	at org.gradle.internal.work.DefaultSynchronizer.withLock(DefaultSynchronizer.java:46)
	at org.gradle.internal.model.StateTransitionController.tryTransition(StateTransitionController.java:177)
	at org.gradle.internal.build.DefaultBuildLifecycleController.executeTasks(DefaultBuildLifecycleController.java:304)
	at org.gradle.internal.build.DefaultBuildWorkGraphController$DefaultBuildWorkGraph.runWork(DefaultBuildWorkGraphController.java:220)
	at org.gradle.internal.work.DefaultWorkerLeaseService.withLocks(DefaultWorkerLeaseService.java:263)
	at org.gradle.internal.work.DefaultWorkerLeaseService.runAsWorkerThread(DefaultWorkerLeaseService.java:127)
	at org.gradle.composite.internal.DefaultBuildController.doRun(DefaultBuildController.java:181)
	at org.gradle.composite.internal.DefaultBuildController.access$000(DefaultBuildController.java:50)
	at org.gradle.composite.internal.DefaultBuildController$BuildOpRunnable.lambda$run$0(DefaultBuildController.java:198)
	at org.gradle.internal.operations.CurrentBuildOperationRef.with(CurrentBuildOperationRef.java:85)
	at org.gradle.composite.internal.DefaultBuildController$BuildOpRunnable.run(DefaultBuildController.java:198)
	at org.gradle.internal.concurrent.ExecutorPolicy$CatchAndRecordFailures.onExecute(ExecutorPolicy.java:64)
	at org.gradle.internal.concurrent.AbstractManagedExecutor$1.run(AbstractManagedExecutor.java:48)
BUILD FAILED in 2m 48s
145 actionable tasks: 145 executed
##[error***Process completed with exit code 1.